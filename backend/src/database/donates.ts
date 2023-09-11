import logger from "utils/logger";
import { Database, OkPacketInterface } from "./database";

export interface Donate {
    id: number;
    amount: number;
    discordID: string;
    approved: boolean;
    approver: string;
    createdAt: Date;
    countIn: boolean;
    type: "psc" | "paypal" | "tipply";
}

export type DonateDBStructure = Array<Donate>

export class Donate {
    constructor(
        public id: number,
        public amount: number,
        public discordID: string,
        public approved: boolean,
        public approver: string,
        public createdAt: Date,
        public countIn: boolean,
        public type: "psc" | "paypal" | "tipply"
    ) {}

    accept() {}
    deny() {}
    delete() {}
}

export class DonateManager {
    private donates: Map<number, Donate> = new Map();

    constructor(private database: Database) {
        this.fetch();
    }

    async getConnection() {
        return await this.database.getBotConnection();
    }

    async fetch() {
        try {
            const conn = await this.getConnection();

            const query = await conn.prepare("SELECT * FROM donates");
            const res: DonateDBStructure = await query.execute();

            res.forEach((donate) => {
                this.donates.set(donate.id, donate);
            });
        } catch(err) {
            logger.error(`MySQL error: Failed to fetch donates: ${err}`);
        }
    }

    async create(discordID: string, donationType: Donate["type"]) {
        try {
            const conn = await this.getConnection();

            const query = await conn.prepare("INSERT INTO donates(discordID, donationType) VALUES(?, ?)");
            const res: OkPacketInterface = await query.execute([ discordID, donationType ]);

            const donate = new Donate(res.insertId, 0, discordID, false, "", new Date(), true, donationType);
            this.donates.set(donate.id, donate);

            return true;
        } catch(err) {
            logger.error(`MySQL error: Failed to create donate: ${err}`);

            return false;
        }
    }

    get(id: number) {
        return this.donates.get(id);
    }
}