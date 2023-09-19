import logger from "utils/logger";
import { Database } from "./database";
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

    constructor(private database: Database) {}

    async getConnection() {
        return await this.database.getBotConnection();
    }

    async fetch() {
        try {
            const connection = await this.getConnection();
            const query = await connection.prepare("SELECT * FROM notes");
            const response: NoteSchema[] = await query.execute();

            if (!response)
                return false;

            response.forEach(note => {
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

    get(id: number) {
        return this.notes.get(id);
    }
}