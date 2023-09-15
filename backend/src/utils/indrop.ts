import { WebhookClient } from "discord.js";
import logger from "./logger";
import config from "config";
import { Embed } from "./discordEmbed";

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

export class IndropManager {
    private key;
    private webhook: WebhookClient;

    constructor(key: string) {
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

    async executePayment(payment: Payment) {
        this.sendDiscord(payment, true);

        return true;
    }

    async sendDiscord(payment: Payment, accept: boolean) {
        this.webhook.send({ embeds: [Embed({
            color: accept ? "#4fdf62" : "#f54242",
            title: "Płatność",
            fields: [
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ...Object.keys(payment).map(key => ({ name: (([x, ...y]) => x.toUpperCase() + y.join("").toLowerCase())(key.replace(/_/gm, " ")), value: `\`${payment[key]}\``, inline: true }))
            ],
            timestamp: new Date()
        })] });
    }
}
