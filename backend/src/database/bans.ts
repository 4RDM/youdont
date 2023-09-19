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
            const query = await connection.prepare("SELECT * FROM bans");
            const response: BanSchema[] = await query.execute();

            response.forEach(ban => this.bans.set(ban.id, new Ban(ban.id, ban.counter)));

            await connection.end();

            return true;
        } catch(err) {
            logger.error(`BansManager.fetch(): "${err}"`);

            return false;
        }
    }

    async createUnban(banID: number) {
        try {
            const connection = await this.getConnection();

            const query = await connection.prepare("INSERT IGNORE INTO forms(banID) VALUES(?)");
            const res: OkPacketInterface = await query.execute([banID]);

            await this.resetBan(banID);

            await connection.end();

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

    async resetBan(banID: number) {
        try {
            const connection = await this.getConnection();

            const query = await connection.prepare("UPDATE bans SET counter = 0 WHERE banID = ?");
            const res: OkPacketInterface = await query.execute([banID]);

            this.bans.set(banID, new Ban(banID, 0));

            await connection.end();

            return res;
        } catch(err) {
            logger.error(`BansManager.resetBan(): ${err}`);

            return false;
        }
    }

    async denyUnban(banID: number) {
        try {
            const connection = await this.getConnection();

            const query = await connection.prepare("UPDATE bans SET counter = counter + 1 WHERE banID = ?");
            await query.execute([banID]);

            this.bans.get(banID)?.increaseCounter();

            await connection.end();

            return await this.getUnban(banID);
        } catch(err) {
            logger.error(`denyUnban DB error: ${err}`);

            return false;
        }
    }

    async acceptUnban(banID: number) {
        return await this.resetBan(banID);
    }
}