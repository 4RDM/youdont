import logger from "utils/logger";
import { Database } from "./database";
import { Payment } from "./payments";
import { Note } from "./notes";

export interface UserSchema {
    discordID: string
    createdAt: string
}

export class User {
    private payments: Payment[] = [];
    private notes: Note[] = [];

    constructor(
        public id: string,
        public createdAt: Date,
    ) {}

    addPayment(payment: Payment) {
        this.payments.push(payment);
    }

    addNote(note: Note) {
        this.notes.push(note);
    }

    getPayment(id: string) {
        return this.payments.find(payment => payment.id === id);
    }

    getNote(noteID: number) {
        return this.notes.find(note => note.noteID == noteID);
    }

    getPayments() {
        return this.payments;
    }

    getNotes() {
        return this.notes;
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
            return logger.error("UserManager.init(): cannot fetch users!");

        res = await this.database.payments.fetch();

        if (!res)
            return logger.error("UserManager.init(): cannot fetch payments!");

        res = await this.database.notes.fetch();

        if (!res)
            return logger.error("UserManager.init(): cannot fetch notes!");
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
                this.user.set(user.discordID, new User(user.discordID, new Date(user.createdAt)))
            );

            await connection.end();

            return true;
        } catch(err) {
            logger.error(`UserManager.fetch(): "${err}"`);

            return false;
        }
    }

    get(id: string) {
        return this.user.get(id);
    }
}