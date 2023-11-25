import logger from "utils/logger";
import { Database, OkPacketInterface } from "./database";
import { User } from "./users";
import { addFile } from "utils/filesystem";
import rcon from "utils/rcon";
import { getBanBySteam } from "plugins/setup/modals/unban";
import { join } from "path";
import { EmbedField, HexColorString, WebhookClient } from "discord.js";
import { Embed } from "utils/embedBuilder";
import config from "config";

const formBody = (details: { [index: string]: string }) => Object.keys(details).map(key => encodeURIComponent(key) + "=" + encodeURIComponent(details[key])).join("&");
const timeBetween = (date: Date, date2: Date) => new Date(date.getTime() - date2.getTime());
const path = join("/home/rdm/server/data/permisje.cfg");

export interface PaymentSchema {
    id: string
    productID: string
    title: string
    price: string
    paymentChannel: string
    email: string
    steamID: string
    steamUsername: string
    discordID: string
    date: string
}

export interface PaymentSchemaAPI {
    id: string
    product_id: string
    title: string
    price: string
    payment_channel: string
    email: string
    steam_id: string
    steam_username: string
    steam_profile: string
    date: string
}

export class Payment {
    public id: string;
    private user: User | null;
    private productID: string;
    private title: string;
    private price: string;
    private paymentChannel: string;
    private email: string;
    private steamID: string;
    private steamUsername: string;
    private steamProfile: string;
    private date: string;

    constructor(payment: PaymentSchema) {
        this.id = payment.id;
        this.productID = payment.productID;
        this.title = payment.title;
        this.price = payment.price;
        this.paymentChannel = payment.paymentChannel;
        this.email = payment.email;
        this.steamID = payment.steamID;
        this.steamUsername = payment.steamUsername;
        this.steamProfile = `https://steamcommunity/profiles/${this.steamID}`;
        this.date = payment.date;
        this.user = null;
    }

    getProductId() {
        return this.productID;
    }
    getTitle() {
        return this.title;
    }
    getPrice() {
        return this.price;
    }
    getPaymentChannel() {
        return this.paymentChannel;
    }
    getEmail() {
        return this.email;
    }
    getSteamId() {
        return this.steamID;
    }
    getSteamUsername() {
        return this.steamUsername;
    }
    getSteamHex() {
        return BigInt(this.steamID).toString(16);
    }
    getSteamProfile() {
        return this.steamProfile;
    }
    getDate() {
        return new Date(this.date);
    }
    assignUser(user: User) {
        this.user = user;
    }
    getUser() {
        return this.user;
    }
}

export class PaymentsManager {
    private payments: Map<string, Payment> = new Map();
    private webhook: WebhookClient;
    private newDiscord: WebhookClient;

    constructor(private database: Database, private key: string) {
        this.webhook = new WebhookClient({ url: config.discord.btDonate });
        this.newDiscord = new WebhookClient({ url: config.discord.btDev });

        this.database.users.once("ready", async() => {
            const res = await this.fetch();

            if (database.devMode)
                return logger.warn("Payments are disabled due to development mode!");

            if (!res)
                return logger.error("PaymentsManager(): cannot fetch payments from database!");

            setInterval(async () => {
                const res = await this.fetchPayments();

                if (!res)
                    return logger.error("PaymentsManager(): cannot fetch payments from API!");

                res.forEach(async ({ date, email, id, payment_channel, price, product_id, steam_id, steam_username, title }) => {
                    const hex = BigInt(steam_id).toString(16);
                    let discordID = await database.players.getDiscordBySteam(`steam:${hex}`);
                    const payment = this.get(id);

                    if (!discordID)
                        discordID = [ "0" ];

                    if (!payment) {
                        const res = await this.create({
                            date,
                            email,
                            id,
                            paymentChannel: payment_channel,
                            price,
                            productID: product_id,
                            steamID: steam_id,
                            steamUsername: steam_username,
                            title,
                            discordID: discordID[0]
                        });

                        if (!res) {
                            logger.warn("PaymentsManager(): Cannot process payment due to create error!");
                            return await this.fraudPayment(id);
                        }

                        const newPayment = this.get(id);

                        if (!newPayment) {
                            logger.warn("PaymentsManager(): Cannot process payment due to database error!");
                            return await this.fraudPayment(id);
                        }

                        const executeRes = await this.executePayment(newPayment);
                        let paymentRes = true;

                        if (!executeRes)
                            paymentRes = await this.fraudPayment(id);
                        else
                            paymentRes = await this.acceptPayment(id);

                        this.sendDiscord(this.webhook, newPayment, executeRes, discordID[0]);

                        return paymentRes;
                    } else {
                        const executeRes = await this.executePayment(payment);
                        let paymentRes = true;

                        if (!executeRes)
                            paymentRes = await this.fraudPayment(id);
                        else
                            paymentRes = await this.acceptPayment(id);

                        this.sendDiscord(this.webhook, payment, executeRes, discordID[0]);

                        return paymentRes;
                    }
                });
            }, 60000);
        });
    }

    async getConnection() {
        return await this.database.getBotConnection();
    }

    async fetch() {
        try {
            const connection = await this.getConnection();
            const query = await connection.prepare("SELECT * FROM payments");
            const response: PaymentSchema[] = await query.execute();

            await connection.end();

            if (!response)
                return false;

            response.forEach(payment => {
                const newPayment = new Payment(payment);

                this.payments.set(payment.id, newPayment);

                const user = this.database.users.get(payment.discordID);

                if (!user)
                    return logger.warn(`PaymentsManager.fetch(): Cannot create payment "${payment.id}", user not found!`);

                newPayment.assignUser(user);
                user.addPayment(newPayment);

                this.payments.set(payment.id, newPayment);
            });

            return true;
        } catch(err) {
            logger.error(`PaymentsManager.fetch(): "${err}"`);

            return false;
        }
    }

    async fetchPayments() {
        try {
            const res = await fetch(`https://indrop.pro/api/auth/${this.key}/payments`);

            if (res.status !== 200)
                return false;

            const json: Array<PaymentSchemaAPI> = await res.json();

            return json;
        } catch(err) {
            logger.error(`PaymentsManager.fetchPayments(): ${err}`);

            return false;
        }
    }

    async create(payment: PaymentSchema) {
        try {
            const res = await this.database.users.create(payment.discordID);

            if (!res)
                return false;

            const connection = await this.getConnection();
            const query = await connection.prepare("INSERT IGNORE INTO payments(id, productID, title, price, paymentChannel, email, steamID, steamUsername, discordID) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)");
            const response: OkPacketInterface = await query.execute([ payment.id, payment.productID, payment.title, payment.price, payment.paymentChannel, payment.email, payment.steamID, payment.steamUsername, payment.discordID ]);

            await connection.end();

            const newPayment = new Payment(payment);

            if (!response.affectedRows) {
                return false;
            }

            const user = this.database.users.get(payment.discordID);

            if (!user) {
                logger.warn(`PaymentsManager.create(): Cannot create payment "${payment.id}", user not found!`);

                return false;
            }

            newPayment.assignUser(user);
            user.addPayment(newPayment);

            this.payments.set(payment.id, newPayment);

            return true;
        } catch(err) {
            logger.error(`PaymentsManager.create(): ${err}`);

            return false;
        }
    }

    get(id: string) {
        return this.payments.get(id);
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
            logger.error(`PaymentsManager.fraudPayment(): ${err}`);

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
            logger.error(`PaymentsManager.acceptPayment(): ${err}`);

            return false;
        }
    }

    async executeUnban(payment: Payment) {
        const ban = await getBanBySteam(payment.getSteamHex());

        const productID = payment.getProductId();

        if (productID == "unban-cheating") {
            return true;
        }

        if (!ban) {
            logger.warn(`Wpłata ${payment.id} zostala odrzucona, nie znaleziono bana!`);
            return false;
        }

        const time = timeBetween(new Date(ban.expire * 1000), new Date()).getTime();
        const hour = (time / 1000 / 60 / 60);

        if (productID == "unban-24h") {
            if (hour >= 24) return false;
        } else if (productID == "unban-1--3-dni") {
            if (hour > 72) return false;
        } else if (productID == "unban-4--7-dni") {
            if (hour > 168) return false;
        } else if (productID == "unban-8--30-dni") {
            if (hour > 720) return false;
        } else if (productID == "unban-30-dni") {
            // _placeholder_
        }

        try {
            rcon(`unban ${ban.banid}`)
                .catch(() => logger.error(`Nie udało się odbanować ${ban.banid}`));
        } catch(err) {
            logger.error(`Nie udało się odbanować ${ban.banid}`);
        } finally {
            // eslint-disable-next-line no-unsafe-finally
            return true;
        }
    }

    async executeRanga(payment: Payment) {
        const ranga = payment.getProductId().replace("ranga-", "").split("-").join("");

        addFile(`add_principal identifier.steam:${payment.getSteamHex()} group.${ranga} # ${payment.id} https://steamcommunity.com/profiles/${payment.getSteamId()} ${new Date().toLocaleDateString()}`, path)
            .then(() => {
                rcon("exec permisje.cfg");
                rcon("refreshallW0");
                return true;
            })
            .catch(() => {
                return false;
            });

        return true;
    }

    async executePayment(payment: Payment) {
        const hex = BigInt(payment.getSteamId()).toString(16);
        let discordID = await this.database.players.getDiscordBySteam(`steam:${hex}`);

        if (!discordID)
            discordID = [ "0" ];

        try {
            let res = true;

            const productID = payment.getProductId();

            if (productID.startsWith("unban"))
                res = await this.executeUnban(payment);

            if (productID.startsWith("ranga"))
                res = await this.executeRanga(payment);

            return res;
        } catch(err) {
            logger.error(err);

            return false;
        }
    }

    async sendWebhook(webhook: WebhookClient, fields: EmbedField[], color: HexColorString, title: string) {
        try {
            webhook.send({ embeds: [ Embed({
                color,
                title,
                fields,
                timestamp: new Date()
            }) ] });
        } catch(err) {
            logger.error(`sendWebhook(): ${err}`);
        }
    }

    async sendDiscord(webhook: WebhookClient, payment: Payment, accept: boolean, discord?: string) {
        this.sendWebhook(webhook, [
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            { name: "Discord", value: discord ? `<@${discord.replace("discord:", "")}> (\`${discord.replace("discord:", "")}\`)` : "`Nie znaleziono`", inline: true },
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ...Object.keys(payment).map(key => ({ name: (([ x, ...y ]) => x.toUpperCase() + y.join("").toLowerCase())(key.replace(/_/gm, " ")), value: `\`${payment[key]}\``, inline: true }))
        ], accept ? "#4fdf62" : "#f54242", "Płatność");
    }
}