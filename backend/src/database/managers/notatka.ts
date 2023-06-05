import { DatabaseCore } from "./database";

export interface NoteDatabaseResult {
	[k: number]: {
		id: number;
		discordID: string;
		authorID: string;
		noteID: number;
		content: string;
		createdAt: Date;
	};
	meta: unknown;
}

// prettier-ignore
export class NotesManager {
	constructor(private databaseCore: DatabaseCore) {}

	async get(discordID: string, noteID: number) {
		try {
			const notes: (NoteDatabaseResult | null) = await this.databaseCore.botpool.query("SELECT * FROM Notes WHERE discordID = ? AND noteID = ?", [discordID, noteID]);

			if (!notes) return null;

			delete notes["meta"];

			if (!notes[0]) return null;

			return notes[0];
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`NotesSQL Error: ${err}`);

			return null;
		}
	}

	async getAll(discordID: string) {
		try {
			const notes: (NoteDatabaseResult | null) = await this.databaseCore.botpool.query("SELECT * FROM Notes WHERE discordID = ?", [discordID]);

			if (!notes) return null;

			delete notes["meta"];

			if (!notes[0]) return null;

			return notes;
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`NotesSQL Error: ${err}`);

			return null;
		}
	}

	async getLast(discordID: string) {
		try {
			const notes: (NoteDatabaseResult | null) = await this.databaseCore.botpool.query("SELECT * FROM Notes WHERE discordID = ? ORDER BY createdAt DESC LIMIT 1", [discordID]);

			if (!notes) return null;

			delete notes["meta"];

			if (!notes[0]) return null;

			return notes[0];
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`NotesSQL Error: ${err}`);

			return null;
		}
	}

	async create(discordID: string, authorID: string, content: string) {
		try {
			const lastNote = await this.getLast(discordID);
			let newID = 0;

			if (!lastNote) newID = 1;
			else newID = lastNote.noteID + 1;

			await this.databaseCore.botpool.query("INSERT INTO Notes (discordID, authorID, noteID, content) VALUES (?, ?, ?, ?)", [discordID, authorID, newID, content]);

			return await this.get(discordID, newID);
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`NotesSQL Error: ${err}`);

			return null;
		}
	}
}
