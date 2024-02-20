import logger from "utils/logger";
import { Database, OkPacketInterface } from "./database";

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
            const res: OkPacketInterface = await connection.execute("INSERT INTO config(dKey, dValue) VALUES(?, ?) ON DUPLICATE KEY UPDATE dValue = VALUES(dValue)", [ key, value ]);

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
            const res: { dKey: string, dValue: string }[] = await connection.query("SELECT * FROM config WHERE dKey = ?", [ key ]);

            await connection.end();

            if (!res[0])
                return null;

            return res[0].dValue;
        } catch(err) {
            logger.error(`ConfigManager.get(): "${err}"`);

            return false;
        }
    }

    async getAll() {
        try {
            const connection = await this.getConnection();
            const res: { dKey: string, dValue: string }[] = await connection.query("SELECT * FROM config");

            await connection.end();

            return res;
        } catch(err) {
            logger.error(`ConfigManager.getAll(): "${err}"`);

            return false;
        }
    }

    async reset(key: string) {
        try {
            const connection = await this.getConnection();
            const res: OkPacketInterface = await connection.execute("DELETE FROM config WHERE dKey = ?", [ key ]);

            await connection.end();

            return res;
        } catch(err) {
            logger.error(`ConfigManager.delete(): "${err}"`);

            return false;
        }
    }
}