import { EventEmitter } from "events";
import { RDMBot } from "main";
import mariadb from "mariadb";
import logger from "utils/logger";

export class Database extends EventEmitter {
    private serverPool;
    private botPool;

    constructor(private client: RDMBot) {
        super();

        this.serverPool = mariadb.createPool({ ...client.config.fivemDB });
        this.botPool = mariadb.createPool({ ...client.config.botDB });
    }

    async botGetConnection() {
        return await this.botPool.getConnection();
    }

    async serverGetConnection() {
        return await this.serverPool.getConnection();
    }

    async testConnection() {
        const conn1 = await this.botGetConnection().then(() => "\x1b[102m OK \x1b[m").catch(() => "\x1b[101m ERROR \x1b[m");
        const conn2 = await this.serverGetConnection().then(() => "\x1b[102m OK \x1b[m").catch(() => "\x1b[101m ERROR \x1b[m");

        logger.warn(`Bot database:   ${conn1}`);
        logger.warn(`FiveM database: ${conn2}`);

        if ((conn1 + conn2).includes("ERROR"))
            this.emit("error");
        else
            this.emit("ready");
    }
}