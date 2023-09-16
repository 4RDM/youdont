import { EventEmitter } from "events";
import { RDMBot } from "main";
import mariadb from "mariadb";
import logger from "utils/logger";

export interface OkPacketInterface {
	affectedRows: number;
	insertId: number;
	warningStatus: number;
}

export class Database extends EventEmitter {
    private serverPool;
    private botPool;

    constructor(private client: RDMBot) {
        super();

        this.serverPool = mariadb.createPool({ ...client.config.fivemDB });
        this.botPool = mariadb.createPool({ ...client.config.botDB });
    }

    async getBotConnection() {
        return await this.botPool.getConnection();
    }

    async serverGetConnection() {
        return await this.serverPool.getConnection();
    }

    async testConnection() {
        const conn1 = await this.getBotConnection().then(() => "\x1b[102m OK \x1b[m").catch(() => "\x1b[101m ERROR \x1b[m");
        const conn2 = await this.serverGetConnection().then(() => "\x1b[102m OK \x1b[m").catch(() => "\x1b[101m ERROR \x1b[m");

        if ((conn1 + conn2).includes("ERROR")) {
            logger.error(`Bot database: ${conn1}`);
            logger.error(`FiveM database: ${conn2}`);
            this.emit("error");
        } else {
            logger.ready(`Bot database: ${conn1}`);
            logger.ready(`FiveM database: ${conn2}`);
            this.emit("ready");
        }
    }
}