import logger from "utils/logger";
import { Database, OkPacketInterface } from "./database";
import { User } from "./users";

export interface PaymentSchema {
    id: string
    productID: string
    title: string
    price: string
    paymentChannel: string
    email: string
    steamID: string
    steamUser: string
    discordID: string
    date: string
}

export class Payment {
    public user: User | null;

    constructor(
        public id: string,
        private productID: string,
        private title: string,
        private price: string,
        private paymentChannel: string,
        private email: string,
        private steamID: string,
        private steamUsername: string,
        private steamProfile: string,
        private date: string,
    ) {
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

    constructor(private database: Database) {}

    async getConnection() {
        return await this.database.getBotConnection();
    }

    async fetch() {
        try {
            const connection = await this.getConnection();
            const query = await connection.prepare("SELECT * FROM payments");
            const response: PaymentSchema[] = await query.execute();

            if (!response)
                return false;

            response.forEach(payment => {
                const newPayment = new Payment(
                    payment.id,
                    payment.productID,
                    payment.title,
                    payment.price,
                    payment.paymentChannel,
                    payment.email,
                    payment.steamID,
                    payment.steamUser,
                    `https://steamcommunity.com/profiles/${payment.steamID}`,
                    payment.date,
                );

                const user = this.database.users.get(payment.discordID);

                if (!user)
                    return logger.warn(`Cannot create payment "${payment.id}", user not found!`);

                newPayment.assignUser(user);
                user.addPayment(newPayment);

                this.payments.set(payment.id, newPayment);
            });

            await connection.end();

            return true;
        } catch(err) {
            logger.error(`PaymentsManager.fetch(): "${err}"`);

            return false;
        }
    }

    async create(payment: PaymentSchema) {
        try {
            const connection = await this.getConnection();
            const query = await connection.prepare("INSERT INTO payments(id, productID, title, price, paymentChannel, email, steamID, steamUser, discordID) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)");
            const response: OkPacketInterface = await query.execute([...Object.values(payment)]);

            if (!response.insertId)
                return false;

            const newPayment = new Payment(
                payment.id,
                payment.productID,
                payment.title,
                payment.price,
                payment.paymentChannel,
                payment.email,
                payment.steamID,
                payment.steamUser,
                `https://steamcommunity.com/profiles/${payment.steamID}`,
                payment.date,
            );

            const user = this.database.users.get(payment.discordID);

            if (!user) {
                logger.warn(`Cannot create payment "${payment.id}", user not found!`);
git 
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
}