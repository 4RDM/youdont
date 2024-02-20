import logger from "utils/logger";
import { Database, OkPacketInterface } from "./database";
import { User } from "./users";

export interface NoteSchema {
    id: number
    discordID: string
    authorID: string
    noteID: number
    content: string
    createdAt: string
}

export class Note {
    public user: User | null;
    public author: User | null;

    constructor(
        public id: number,
        public noteID: number,
        public content: string,
        public createdAt: Date
    ) {
        this.user = this.author = null;
    }

    assignUser(user: User) {
        this.user = user;
    }

    assignAuthor(user: User) {
        this.author = user;
    }
}

export class NotesManager {
    private notes: Map<number, Note> = new Map();

    constructor(private database: Database) {
        this.database.users.on("ready", async () => {
            const res = await this.fetch();

            if (!res)
                return logger.error("NotesManager(): cannot fetch notes!");
        });
    }

    async getConnection() {
        return await this.database.getBotConnection();
    }

    async fetch() {
        try {
            const connection = await this.getConnection();
            const res: NoteSchema[] = await connection.query("SELECT * FROM notes");

            await connection.end();

            if (!res)
                return false;

            res.forEach(note => {
                const newNote = new Note(note.id, note.noteID, note.content, new Date(note.createdAt));

                const user = this.database.users.get(note.discordID);
                const author = this.database.users.get(note.authorID);

                if (!user)
                    return logger.warn(`Cannot create note "${note.id}", user not found!`);

                if (!author)
                    return logger.warn(`Cannot create note "${note.id}", author not found!`);

                newNote.assignUser(user);
                newNote.assignAuthor(user);

                user.addNote(newNote);

                this.notes.set(note.id, newNote);
            });

            return true;
        } catch(err) {
            logger.error(`NotesManager.fetch(): "${err}"`);

            return false;
        }
    }

    async create(content: string, discordID: string, authorID: string) {
        try {
            const userRes = await this.database.users.create(discordID);
            const authorRes = await this.database.users.create(authorID);

            if (!userRes || !authorRes)
                return false;

            const notes = this.getUserNotes(discordID);

            const connection = await this.getConnection();
            const res: OkPacketInterface = await connection.execute("INSERT INTO notes(discordID, authorID, content, noteID) VALUES(?, ?, ?, ?)", [ discordID, authorID, content, notes ? notes.length + 1 : 1 ]);

            await connection.end();

            const note = new Note(
                res.insertId,
                notes ? notes.length + 1 : 1,
                content,
                new Date()
            );

            const user = this.database.users.get(discordID);
            const author = this.database.users.get(authorID);

            if (!user)
                return logger.error(`Cannot create note "${res.insertId}", user not found!`);

            if (!author)
                return logger.error(`Cannot create note "${res.insertId}", author not found!`);

            note.assignUser(user);
            note.assignAuthor(author);

            user.addNote(note);

            this.notes.set(res.insertId, note);

            return note;
        } catch(err) {
            logger.error(`NotesManager.create(): "${err}"`);

            return false;
        }
    }

    async delete(id: number) {
        try {
            const connection = await this.getConnection();
            const res: OkPacketInterface = await connection.execute("DELETE FROM notes WHERE id = ?", [ id ]);

            await connection.end();

            const note = this.notes.get(id);

            if (!note)
                return false;

            if (!note.user)
                return false;

            note.user.deleteNoteByID(note.noteID);

            this.notes.delete(id);

            return res;
        } catch(err) {
            logger.error(`NotesManager.delete(): "${err}"`);

            return false;
        }
    }

    get(id: number) {
        return this.notes.get(id);
    }

    getUserNotes(discordID: string) {
        const user = this.database.users.get(discordID);

        if (!user)
            return null;

        return user.getNotes();
    }
}
