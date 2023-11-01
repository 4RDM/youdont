import logger from "utils/logger";
import { Database, OkPacketInterface } from "./database";

/**
 * note: Key length can't be longer than 100 characters.
 */

export class ConfigManager {
    constructor(private database: Database) {}

    async getConnection() {
        return await this.database.getBotConnection();
    }

    async set(key: string, value: string) {
        if (key.length > 100)
            return -1;

        try {
            const connection = await this.getConnection();
            const query = await connection.prepare("INSERT INTO config(dKey, dValue) VALUES(?, ?) ON DUPLICATE KEY UPDATE dValue = VALUES(dValue)");
            const res: OkPacketInterface = await query.execute([key, value]);

            await connection.end();

            return res;
        } catch(err) {
            logger.error(`ConfigManager.set(): "${err}"`);

            return false;
        }
    }

    async get(key: string) {
        try {
            const connection = await this.getConnection();
            const query = await connection.prepare("SELECT * FROM config WHERE dKey = ?");
            const res: { dKey: string, dValue: string }[] = await query.execute([key]);

            await connection.end();

            return res[0].dValue;
        } catch(err) {
            logger.error(`ConfigManager.get(): "${err}"`);

            return false;
        }
    }
}