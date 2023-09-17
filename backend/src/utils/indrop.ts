import { EmbedField, HexColorString, WebhookClient } from "discord.js";
import logger from "./logger";
import config from "config";
import { Embed } from "./discordEmbed";
import { getBanBySteam } from "bot/events/interactions/modalSubmit";
import { addFile } from "./filesystem";
import { join } from "path";
import { Client } from "bot/main";

interface Payment {
    id: string
    product_id: string
    title: string
    price: string
    payment_channel: string
    email: string
    steam_id: string
    steam_user: string
    steam_profile: string
    date: string
}

const formBody = (details: { [index: string]: string }) => Object.keys(details).map(key => encodeURIComponent(key) + "=" + encodeURIComponent(details[key])).join("&");

const timeBetween = (date: Date, date2: Date) => new Date(date.getTime() - date2.getTime());

const path = join("/home/rdm/server/data/permisje.cfg");

export class IndropManager {
    private key;
    private webhook: WebhookClient;

    constructor(private client: Client, key: string) {
        this.key = key;

        this.webhook = new WebhookClient({ url: config.btDonate });
        this.init();
    }

    async init() {
        setInterval(async () => {
            const payments = await this.refresh();

            if (!payments)
                return logger.error("Cannot fetch payments!");
        }, 10000);
    }

    async refresh() {
        const payments = await this.fetchPayments();

        if (!payments) return false;
        else {
            payments.forEach(async (payment) => {
                let res = await this.executePayment(payment);

                if (!res) {
                    res = await this.fraudPayment(payment.id);

                    if (!res)
                        logger.error("Cannot fraud payment!");
                } else {
                    res = await this.acceptPayment(payment.id);

                    if (!res)
                        logger.error("Cannot accept payment!");
                }
            });

            return true;
        }
    }

    async fetchPayments() {
        try {
            const res = await fetch(`https://indrop.pro/api/auth/${this.key}/payments`);

            if (res.status !== 200)
                return false;

            const json: Array<Payment> = await res.json();

            return json;
        } catch(err) {
            logger.error(`fetchPayments(): ${err}`);

            return false;
        }
    }

    async acceptPayment(id: string) {
        try {
            const res = await fetch(
                `https://indrop.pro/api/auth/${this.key}/payment`,
                {
                    body: formBody({ id }),
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    method: "post"
                }
            );

            const text = await res.text();

            if (res.status !== 200 || text !== "OK")
                return false;

            return true;
        } catch(err) {
            logger.error(`acceptPayment(): ${err}`);

            return false;
        }
    }

    async fraudPayment(id: string) {
        try {
            const res = await fetch(
                `https://indrop.pro/api/auth/${this.key}/payment-fraud`,
                {
                    body: formBody({ id }),
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    method: "post"
                }
            );

            const text = await res.text();

            if (res.status !== 200 || text !== "OK")
                return false;

            return true;
        } catch(err) {
            logger.error(`fraudPayment(): ${err}`);

            return false;
        }
    }

    async executeUnban(payment: Payment, hex: string) {
        const ban = await getBanBySteam(hex);

        if (payment.product_id == "unban-cheating") {
            return true;
        }

        if (!ban) {
            logger.warn(`Wpłata ${payment.id} zostala odrzucona, nie znaleziono bana!`);
            return false;
        }

        const time = timeBetween(new Date(ban.expire * 1000), new Date()).getTime();
        const hour = (time / 1000 / 60 / 60);

        if (payment.product_id == "unban-24h") {
            if (hour >= 24) return false;
        } else if (payment.product_id == "unban-1--3-dni") {
            if (hour > 72) return false;
        } else if (payment.product_id == "unban-4--7-dni") {
            if (hour > 168) return false;
        } else if (payment.product_id == "unban-8--30-dni") {
            if (hour > 720) return false;
        } else if (payment.product_id == "unban-30-dni") {
            // _placeholder_
        }

        try {
            this.client.core.rcon(`unban ${ban.banid}`)
                .catch(() => logger.error(`Nie udało się odbanować ${ban.banid}`));
        } catch(err) {
            logger.error(`Nie udało się odbanować ${ban.banid}`);
        } finally {
            return true;
        }
    }

    async executeRanga(payment: Payment, hex: string) {
        const ranga = payment.product_id.replace("ranga-", "").split("-").join("");

        addFile(`add_principal identifier.steam:${hex} group.${ranga} # ${payment.id} https://steamcommunity.com/profiles/${payment.steam_id} ${new Date().toLocaleDateString()}`, path)
            .then(() => {
                this.client.core.rcon("exec permisje.cfg");
                this.client.core.rcon("refreshallW0");
                return true;
            })
            .catch(() => {
                return false;
            });

        return true;
    }

    async executePayment(payment: Payment) {
        const hex = BigInt(payment.steam_id).toString(16);
        let res = true;

        try {
            if (payment.product_id.startsWith("unban"))
                res = await this.executeUnban(payment, hex);

            if (payment.product_id.startsWith("ranga"))
                res = await this.executeRanga(payment, hex);

            this.sendDiscord(payment, res);

            const discord = await this.client.core.database.playerData.getDiscordBySteam(`steam:${hex}`);

            if (discord) {
                const user = await this.client.users.fetch(discord[0].replace("discord:", ""));
                if (user) {
                    user.send({ embeds: [
                        Embed({
                            title: ":money_with_wings: | Dziękujemy za zakupy!",
                            description: "Dziękujemy za zakupy w naszym sklepie internetowym, w razie jakichkolwiek pytań zapraszamy do kontaktu przez otwarcie zgłoszenia na naszym oficjalnym [serwerze discord](https://discord.gg/4rdm) <#843444694226960394>. W celu odbioru zamówionych przedmiotów zapraszamy do kontaktu z administracją!\n**Jeżeli kupiłeś unban za cheaty musisz skontaktować się przez ticketa!**",
                            fields: [
                                {
                                    name: "ID transakcji",
                                    value: `\`${payment.id}\``,
                                    inline: true,
                                },
                                {
                                    name: "Kwota",
                                    value: `\`${payment.price}\``,
                                    inline: true,
                                }
                            ],
                            color: "#4fdf62",
                            timestamp: new Date(),
                            thumbnail: "https://4rdm.pl/assets/logo.png"
                        })
                    ] }).catch(_ => logger.error(`${user.tag} has closed DMs!`));
                }
            }

            return res;
        } catch(err) {
            logger.error(err);
            return false;
        }
    }

    async sendWebhook(fields: EmbedField[], color: HexColorString, title: string) {
        this.webhook.send({ embeds: [Embed({
            color,
            title,
            fields,
            timestamp: new Date()
        })] });
    }

    async sendDiscord(payment: Payment, accept: boolean) {
        this.sendWebhook([
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ...Object.keys(payment).map(key => ({ name: (([x, ...y]) => x.toUpperCase() + y.join("").toLowerCase())(key.replace(/_/gm, " ")), value: `\`${payment[key]}\``, inline: true }))
        ], accept ? "#4fdf62" : "#f54242", "Płatność",
        );
    }
}
