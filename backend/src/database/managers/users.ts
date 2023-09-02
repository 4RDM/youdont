import { DatabaseCore } from "./database";
import { DonateDatabaseResult } from "./donates";
import { NoteDatabaseResult } from "./notes";

export interface User {
	discordID: string;
	total: number;
	realTotal: number;
	createdAt: Date;
}

export interface UserDatabaseResult extends Array<User> {
	[k: number]: User;
}

interface IUser {
	identifier: string;
	license: string;
	discord: string;
	deaths: number;
	heady: number;
	kills: number;
}

export type DBUser = null | IUser;

export class UsersManager {
	constructor(private databaseCore: DatabaseCore) {}

	async get(discordID: string) {
		try {
			const user: UserDatabaseResult = await this.databaseCore.botpool.query("SELECT * FROM users WHERE discordID = ?", [discordID]);

			if (!user[0]) return null;

			const donates = (await this.databaseCore.donates.getAll(discordID)) || [] as DonateDatabaseResult;
			const notes = (await this.databaseCore.notes.getAll(discordID)) || [] as NoteDatabaseResult;

			const finalUser = Object.assign({ donates: [] as DonateDatabaseResult, notes: [] as NoteDatabaseResult }, { ...user[0], donates, notes });

			return finalUser;
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`UsersSQL GET Error: ${err}`);

			return null;
		}
	}

	async create(discordID: string, total?: number, realTotal?: number) {
		try {
			const user = await this.get(discordID);

			if (user) return user;

			await this.databaseCore.botpool.query("INSERT INTO users (discordID, total, realTotal) VALUES (?, ?, ?)", [discordID, total || 0, realTotal || 0]);

			return await this.get(discordID);
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`UsersSQL CREATE Error: ${err}`);

			return null;
		}
	}

	async getUserFromServer(discordID: string): Promise<DBUser | null> {
		try {
			const response: DBUser = (await this.databaseCore.serverpool.query(`SELECT * FROM kdr WHERE \`discord\` = '${discordID}' LIMIT 1`))[0];

			return response;
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`ServerSQL GET Error: ${err}`);

			return null;
		}
	}

	async getUsersFromServer(discordID: string): Promise<DBUser[] | null> {
		try {
			const response: DBUser[] = (await this.databaseCore.serverpool.query(`SELECT * FROM kdr WHERE \`discord\` = '${discordID}'`));

			if (!response[0]) return null;

			return response;
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`ServerSQL GET Error: ${err}`);

			return null;
		}
	}
}
