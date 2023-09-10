import { readFileSync } from "fs";
import { join } from "path";
import { DatabaseCore, OkPacketInterface } from "./database";
import logger from "utils/logger";

export interface PlayerElement {
    license: string;
    name: string;
    playTime: number;
    tsJoined: number;
    tsLastConnection: number;
    notes: Notes;
}

export interface PlayerShort {
    license: string;
    playTime: number;
}

export interface Players {
    version: number;
    players: PlayerElement[];
}

export interface Notes {
    text: string;
    lastAdmin: string;
    tsLastEdit: number;
}

const prodPath = join("/", "home", "rdm", "server", "base", "txData", "default", "data", "playersDB.json");
const devPath = join(__dirname, "..", "..", "..", "playersDB.json");

export class PlayerDataManager {
    public players: PlayerShort[];

    constructor(private database: DatabaseCore) {
        const json: Players = JSON.parse(readFileSync(process.env.NODE_ENV == "production" ? prodPath : devPath, { encoding: "utf-8" }).toString());

        if (json.players)
            this.players = json.players.map(({ license, playTime }) => ({
                license,
                playTime,
            }));
        else this.players = [];

        setInterval(() => {
            const json: Players = JSON.parse(readFileSync(process.env.NODE_ENV == "production" ? prodPath : devPath, { encoding: "utf-8" }).toString());
            if (json.players) this.players = json.players.map(({ license, playTime }) => ({ license, playTime }));
            else this.players = [];
        }, 1000 * 60 * 15);
    }

    getUser(discordID: string): PlayerShort {
        const player = this.players.find(user => user.license == discordID);

        if (!player) return { license: discordID, playTime: 0 };

        return player;
    }

    async getDiscordBySteam(steam: string) {
        try {
            const connection = await this.database.serverpool.getConnection();

            const query = await connection.prepare("SELECT discord FROM users WHERE identifier = ?");
            const res: Array<{ discord: string }> = await query.execute([steam]);

            return res.flatMap(x => x.discord);
        } catch(err) {
            logger.error(`getDiscordBySteam DB error: ${err}`);

            return false;
        }
    }

    async createUnban(banID: string) {
        try {
            const connection = await this.database.botpool.getConnection();

            const query = await connection.prepare("INSERT IGNORE INTO forms(banID) VALUES(?)");
            const res: OkPacketInterface = await query.execute([banID]);

            await this.resetBan(banID);

            return res;
        } catch(err) {
            logger.error(`denyUnban DB error: ${err}`);

            return false;
        }
    }

    async acceptUnban(banID: string) {
        return await this.resetBan(banID);
    }

    async getUnban(banID: string) {
        try {
            const connection = await this.database.botpool.getConnection();

            const query = await connection.prepare("SELECT counter FROM forms WHERE banID = ?");
            const res: Array<{ counter: number }> = await query.execute([banID]);

            return res.flatMap(x => x.counter);
        } catch(err) {
            logger.error(`denyUnban DB error: ${err}`);

            return false;
        }
    }

    async denyUnban(banID: string) {
        try {
            const connection = await this.database.botpool.getConnection();

            const query = await connection.prepare("UPDATE forms SET counter = counter + 1 WHERE banID = ?");
            await query.execute([banID]);

            return await this.getUnban(banID);
        } catch(err) {
            logger.error(`denyUnban DB error: ${err}`);

            return false;
        }
    }

    async resetBan(banID: string) {
        try {
            const connection = await this.database.botpool.getConnection();

            const query = await connection.prepare("UPDATE forms SET counter = 0 WHERE banID = ?");
            const res: OkPacketInterface = await query.execute([banID]);

            return res;
        } catch(err) {
            logger.error(`resetBan DB error: ${err}`);

            return false;
        }
    }
}
