import { DatabaseCore, OkPacketInterface } from "./database";

export interface Donate {
	id: number;
	amount: number;
	discordID: string;
	approved: boolean;
	approver: string;
	createdAt: Date;
	type: "psc" | "paypal" | "tipply";
}

export interface DonateDatabaseResult extends Array<Donate> {
	[k: number]: Donate;
}

// prettier-ignore
export class DonatesManager {
	constructor(private databaseCore: DatabaseCore) {}

	async get(donateID: number): Promise<Donate | null> {
		try {
			const donate: DonateDatabaseResult = await this.databaseCore.botpool.query("SELECT * FROM donates WHERE id = ?", [donateID]);
		
			if (!donate[0]) return null;

			return donate[0];
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`DonatesSQL GET Error: ${err}`);

			return null;
		}
	}

	async getAll(discordID: string): Promise<DonateDatabaseResult | null> {
		try {
			const donates: DonateDatabaseResult = await this.databaseCore.botpool.query("SELECT * FROM donates WHERE discordID = ?", [discordID]);

			if (!donates[0]) return null;

			return donates;
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`DonatesSQL GETALL Error: ${err}`);

			return null;
		}
	}
	
	async getLastManyUnaproved(howMany: number): Promise<DonateDatabaseResult | null> {
		try {
			const donates: DonateDatabaseResult = await this.databaseCore.botpool.query("SELECT * FROM donates WHERE donates.approved = FALSE ORDER BY donates.id DESC LIMIT ?", howMany);

			if (!donates[0]) return null;

			return donates;
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`DonatesSQL getLastManyUnaproved Error: ${err}`);

			return null;
		}
	}

	async create({ discordID, type, timestamp }: { discordID: string, type: "psc" | "paypal" | "tipply", timestamp?: Date }): Promise<Donate | null> {
		try {
			const donate: OkPacketInterface = await this.databaseCore.botpool.query(`INSERT INTO donates (discordID, donationType${timestamp ? ", createdAt" : ""}) VALUES (?, ?${timestamp ? ", ?": ""})`, [discordID, type, timestamp]);

			if (!donate.insertId) return null;

			return await this.get(donate.insertId as number);
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`DonatesSQL CREATE Error: ${err}`);

			return null;
		}
	}

	async approve(donateID: number, amount: number, approver: string): Promise<Donate | null> {
		try {
			await this.databaseCore.botpool.query("UPDATE donates SET approved = true, amount = ?, approver = ? WHERE id = ?", [amount, approver, donateID]);

			const donate = await this.get(donateID);
			if (!donate) return null;

			await this.databaseCore.botpool.query("UPDATE users SET total = total + ? WHERE discordID = ?", [amount, donate.discordID]);

			return await this.get(donateID);
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`DonatesSQL APPROVE Error: ${err}`);

			return null;
		}
	}
}
