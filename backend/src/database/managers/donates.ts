import { DatabaseCore } from "./database";

export interface Donate {
	id: number;
	amount: number;
	discordID: string;
	approved: boolean;
	approver: string;
	createdAt: Date;
	type: "psc" | "paypal" | "tipply";
}

export interface DonateDatabaseResult {
	[k: number]: Donate;
	meta: unknown;
}

// prettier-ignore
export class DonatesManager {
	constructor(private databaseCore: DatabaseCore) {}

	async get(donateID: number): Promise<Donate | null> {
		try {
			const donate: (DonateDatabaseResult | null) = await this.databaseCore.botpool.query("SELECT * FROM donates WHERE id = ?", [donateID]);
		
			if (!donate) return null;

			delete donate["meta"];

			if (!donate[0]) return null;

			return donate[0];
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`DonatesSQL Error: ${err}`);

			return null;
		}
	}

	async getAll(discordID: string): Promise<DonateDatabaseResult | null> {
		try {
			const donates: (DonateDatabaseResult | null) = await this.databaseCore.botpool.query("SELECT * FROM donates WHERE discordID = ?", [discordID]);

			if (!donates) return null;

			delete donates["meta"];

			if (!donates[0]) return null;

			return donates;
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`DonatesSQL Error: ${err}`);

			return null;
		}
	}

	async create(discordID: string, type: "psc" | "paypal" | "tipply"): Promise<Donate | null> {
		try {
			const donate = await this.databaseCore.botpool.query("INSERT INTO donates (discordID, donationType) VALUES (?, ?)", [discordID, type]);

			if (!donate) return null;

			return await this.get(donate.insertId);
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`DonatesSQL Error: ${err}`);

			return null;
		}
	}

	async approve(donateID: number, amount: number, approver: string): Promise<Donate | null> {
		try {
			let donate: (Donate | null) = await this.databaseCore.botpool.query("UPDATE donates SET approved = true, amount = ?, approver = ? WHERE id = ?", [amount, approver, donateID]);

			if (!donate) return null;

			donate = await this.get(donateID);

			if (!donate) return null;

			return donate;
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`DonatesSQL Error: ${err}`);

			return null;
		}
	}
}
