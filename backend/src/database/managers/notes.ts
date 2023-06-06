import { DatabaseCore } from "./database";
import mariadb from "mariadb";

export interface Note {
	id: number;
	discordID: string;
	authorID: string;
	noteID: number;
	content: string;
	createdAt: Date;
}

export interface NoteDatabaseResult extends Array<Note> {
	[k: number]: Note;
}

// prettier-ignore
export class NotesManager {
	constructor(private databaseCore: DatabaseCore) {}

	async get(discordID: string, noteID: number) {
		try {
			const notes: NoteDatabaseResult = await this.databaseCore.botpool.query("SELECT * FROM notes WHERE discordID = ? AND noteID = ? LIMIT 1", [discordID, noteID]);

			if (!notes[0]) return null;

			return notes[0];
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`NotesSQL GET Error: ${err}`);

			return null;
		}
	}

	async getAll(discordID: string) {
		try {
			const notes: NoteDatabaseResult = await this.databaseCore.botpool.query("SELECT * FROM notes WHERE discordID = ?", [discordID]);

			if (!notes[0]) return null;

			return notes;
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`NotesSQL GETALL Error: ${err}`);

			return null;
		}
	}

	async getLast(discordID: string) {
		try {
			const notes: NoteDatabaseResult = await this.databaseCore.botpool.query("SELECT * FROM notes WHERE discordID = ? ORDER BY createdAt DESC LIMIT 1", [discordID]);

			if (!notes[0]) return null;

			return notes[0];
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`NotesSQL GETLAST Error: ${err}`);

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
			this.databaseCore.core.bot.logger.error(`NotesSQL CREATE Error: ${err}`);

			return null;
		}
	}

	async delete(discordID: string, noteID: number) {
		try {
			await this.databaseCore.botpool.query("DELETE FROM Notes WHERE discordID = ? AND noteID = ?", [discordID, noteID]);

			return true;
		} catch (err) {
			this.databaseCore.core.bot.logger.error(`NotesSQL DELETE Error: ${err}`);

			return false;
		}
	}
}
