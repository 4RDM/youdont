import logger from "utils/logger";
import { Database } from "./database";
import { Payment } from "./payments";

export interface UserSchema {
    discordID: string
    createdAt: number
}

export class User {
    constructor(
        public id: string,
        public createdAt: Date,
        private payments: Payment[]
    ) {}

    addPayment(payment: Payment) {
        this.payments.push(payment);
    }

    getPayment(id: string) {
        return this.payments.find(payment => payment.id === id);
    }

    getPayments() {
        return this.payments;
    }
}

export class UsersManager {
    private user: Map<string, User> = new Map();

    constructor(private database: Database) {
        this.init();
    }

    async init() {
        let res = await this.fetch();

        if (!res)
            logger.error("UserManager.init(): cannot fetch users!");

        res = await this.database.payments.fetch();

        if (!res)
            logger.error("UserManager.init(): cannot fetch donates!");
    }

    async getConnection() {
        return await this.database.getBotConnection();
    }

    async fetch() {
        try {
            const connection = await this.getConnection();
            const query = await connection.prepare("SELECT * FROM users");
            const response: UserSchema[] = await query.execute();

            if (!response)
                return false;

            response.forEach(user =>
                this.user.set(user.discordID, new User(user.discordID, new Date(user.createdAt), []))
            );
        } catch(err) {
            logger.error(`UserManager.fetchUsers(): ${err}`);
            return false;
        }
    }

    get(id: string) {
        return this.user.get(id);
    }
}