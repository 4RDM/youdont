import { DatabaseCore } from "./database";

export interface UserDatabaseResult {
	[k: number]: {
		discordID: string;
		total: number;
		createdAt: Date;
	};
	meta: unknown;
}

// prettier-ignore
export class UsersManager {
	constructor(private databaseCore: DatabaseCore) {}

	async get(discordID: string) {
		try {
			const user: (UserDatabaseResult | null) = await this.databaseCore.botpool.query("SELECT * FROM users WHERE discordID = ?", [discordID]);

			if (!user) return null;

			delete user["meta"];

			const donates = (await this.databaseCore.donates.getAll(discordID)) || [];
			const notes = (await this.databaseCore.notes.getAll(discordID)) || [];

			if (!user[0]) return null;

			const finalUser = Object.assign({ donates: [], notes: [] }, { ...user[0], donates, notes });

			return finalUser;
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`UsersSQL Error: ${err}`);

			return null;
		}
	}

	async create(discordID: string, total?: number) {
		try {
			const user = await this.get(discordID);

			if (user) return user;

			await this.databaseCore.botpool.query("INSERT INTO users (discordID, total) VALUES (?, ?)", [discordID, total || 0]);

			return await this.get(discordID);
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`UsersSQL Error: ${err}`);

			return null;
		}
	}
}
