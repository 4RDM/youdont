import { RDMBot } from "main";
import mariadb from "mariadb";

export class Database {
    private serverPool;
    private botPool;

    constructor(private client: RDMBot) {
        this.serverPool = mariadb.createPool({ ...client.config.fivemDB });
        this.botPool = mariadb.createPool({ ...client.config.botDB });
    }

    async botGetConnection() {
        return await this.botPool.getConnection();
    }

    async serverGetConnection() {
        return await this.serverPool.getConnection();
    }
}