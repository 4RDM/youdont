import logger from "utils/logger";
import { Database, OkPacketInterface } from "./database";
import { Payment } from "./payments";
import { Note } from "./notes";
import { EventEmitter } from "events";

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

export class UsersManager extends EventEmitter {
    private users: Map<string, User> = new Map();

    constructor(private database: Database) {
        super();
        this.init();
    }

    async init() {
        const res = await this.fetch();

        if (!res)
            logger.error("UserManager.init(): cannot fetch users!");

        this.emit("ready");
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
                this.users.set(user.discordID, new User(user.discordID, new Date(user.createdAt)))
            );

            await connection.end();

            return true;
        } catch(err) {
            logger.error(`UserManager.fetch(): "${err}"`);

            return false;
        }
    }

    async create(discordID: string) {
        try {
            const connection = await this.getConnection();
            const query = await connection.prepare("INSERT IGNORE INTO users(discordID) VALUES(?)");
            const response: OkPacketInterface = await query.execute([discordID]);

            if (response.affectedRows) {
                const newUser = new User(discordID, new Date());
                this.users.set(discordID, newUser);
            }

            return true;
        } catch(err) {
            logger.error(`UsersManager.create(): ${err}`);

            return false;
        }
    }

    get(id: string) {
        return this.users.get(id);
    }
}