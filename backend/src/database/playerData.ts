import { readFileSync } from "fs";
import { join } from "path";
import { Database } from "./database";
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

interface Player {
    identifier: string;
    license: string;
    discord: string;
    deaths: number;
    heady: number;
    kills: number;
}

export type DBUser = null | Player;

const prodPath = "/home/rdm/server/base/txData/default/data/playersDB.json";
const devPath = join(__dirname, "..", "playersDB.json");

export class PlayerDataManager {
    public players: PlayerShort[];

    constructor(private database: Database) {
        const file = readFileSync(process.env.NODE_ENV == "production" ? prodPath : devPath, { encoding: "utf-8" });
        const json: Players = JSON.parse(file);

        if (json.players)
            this.players = json.players.map(({ license, playTime }) => ({
                license,
                playTime,
            }));
        else this.players = [];

        setInterval(() => {
            const file = readFileSync(process.env.NODE_ENV == "production" ? prodPath : devPath, { encoding: "utf-8" }).toString();
            const json: Players = JSON.parse(file);

            if (json.players)
                this.players = json.players.map(({ license, playTime }) => ({
                    license,
                    playTime,
                }));
            else this.players = [];
        }, 1000 * 60 * 15);
    }

    async getUserFromServer(discordID: string) {
        try {
            const connection = await this.database.getServerConnection();
            const query = await connection.prepare("SELECT * FROM kdr WHERE discord = ?");
            const res: DBUser[] = await query.execute([ discordID ]);

            await connection.end();

            return res;
        } catch (err) {
            return logger.error(`getUserFromServer DB error: ${err}`);
        }
    }

    async getDiscordBySteam(steam: string) {
        try {
            const connection = await this.database.getServerConnection();
            const query = await connection.prepare("SELECT discord FROM users WHERE identifier = ?");
            const res: Array<{ discord: string }> = await query.execute([ steam ]);

            await connection.end();
            
            const flatMap = res.flatMap(x => x.discord);
            
            if (!flatMap[0]) return null;

            return flatMap;
        } catch(err) {
            return logger.error(`getDiscordBySteam DB error: ${err}`);
        }
    }

    getSteamByDiscord(discordID: string): PlayerShort {
        const player = this.players.find(user => user.license == discordID);

        if (!player) return { license: discordID, playTime: 0 };

        return player;
    }

    get(license: string): PlayerShort {
        const player = this.players.find(user => user.license == license);

        if (!player) return { license, playTime: 0 };

        return player;
    }
}
