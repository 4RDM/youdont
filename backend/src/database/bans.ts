import logger from "utils/logger";
import { Database, OkPacketInterface } from "./database";

export interface BanSchema {
    id: number
    counter: number
}

export class Ban {
    constructor(public id: number, public counter: number) {}

    increaseCounter() {
        this.counter++;
    }
}

export class BansManager {
    private bans: Map<number, Ban> = new Map();

    constructor(private database: Database) {
        this.fetch();
    }

    async getConnection() {
        return await this.database.getBotConnection();
    }

    async fetch() {
        try {
            const connection = await this.getConnection();
            const response: BanSchema[] = await connection.query("SELECT * FROM bans");

            await connection.end();

            response.forEach(ban => this.bans.set(ban.id, new Ban(ban.id, ban.counter)));

            return true;
        } catch(err) {
            logger.error(`BansManager.fetch(): "${err}"`);

            return false;
        }
    }

    async createUnban(banID: number) {
        try {
            const connection = await this.getConnection();

            const res: OkPacketInterface = await connection.execute("INSERT IGNORE INTO bans(banID) VALUES(?)" ,[ banID ]);

            await connection.end();

            await this.resetUnban(banID);

            return res;
        } catch(err) {
            logger.error(`BansManager.createUnban(): ${err}`);

            return false;
        }
    }

    async getUnban(banID: number) {
        const cache = this.bans.get(banID);

        if (!cache) {
            await this.createUnban(banID);
            return this.bans.get(banID);
        } else
            return cache;
    }

    async resetUnban(banID: number) {
        try {
            const connection = await this.getConnection();

            const res: OkPacketInterface = await connection.execute("UPDATE bans SET counter = 0 WHERE banID = ?", [ banID ]);

            await connection.end();

            this.bans.set(banID, new Ban(banID, 0));

            return res;
        } catch(err) {
            logger.error(`BansManager.resetBan(): ${err}`);

            return false;
        }
    }

    async denyUnban(banID: number) {
        try {
            await this.getUnban(banID);

            const connection = await this.getConnection();

            await connection.execute("UPDATE bans SET counter = counter + 1 WHERE banID = ?", [ banID ]);

            await connection.end();

            this.bans.get(banID)?.increaseCounter();

            return await this.getUnban(banID);
        } catch(err) {
            logger.error(`denyUnban DB error: ${err}`);

            return false;
        }
    }

    async acceptUnban(banID: number) {
        await this.getUnban(banID);
        return await this.resetUnban(banID);
    }
}