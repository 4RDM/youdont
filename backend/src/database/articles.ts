import logger from "utils/logger";
import { Database, OkPacketInterface } from "./database";

interface ArticleDatabaseResultObject {
    id: string;
    title: string;
    content: string;
    articleURL: string;
    articleDescription: string;
    discordID: string;
    views: number;
    createdAt: Date;
    editedAt: Date;
}

export interface ArticleDatabaseResult extends Array<ArticleDatabaseResultObject> {
    [k: number]: ArticleDatabaseResultObject;
}

export class ArticlesManager {
    constructor(private database: Database) {}

    async getConnection() {
        return await this.database.getBotConnection();
    }

    async getByURL(articleURL: string): Promise<ArticleDatabaseResultObject | null> {
        try {
            const connection = await this.getConnection();
            let query = await connection.prepare("SELECT * FROM articles WHERE articleURL = ? LIMIT 1");
            const res: ArticleDatabaseResult = await query.execute([ articleURL ]);

            if (!res[0]) {
                await connection.end();
                return null;
            }

            query = await connection.prepare("UPDATE articles SET views = views + 1 WHERE articleURL = ?");
            await query.execute([ articleURL ]);

            await connection.end();

            return res[0];
        } catch (err) {
            logger.error(`ArticlesManager.getByURL(): ${err}`);

            return null;
        }
    }

    async get(id: number): Promise<ArticleDatabaseResultObject | null> {
        try {
            const connection = await this.getConnection();
            let query = await connection.prepare("SELECT * FROM articles WHERE id = ? LIMIT 1");
            const res: ArticleDatabaseResult = await query.execute([ id ]);

            if (!res[0]) {
                await connection.end();
                return null;
            }

            query = await connection.prepare("UPDATE articles SET views = views + 1 WHERE id = ?");
            await query.execute([ id ]);

            await connection.end();

            return res[0];
        } catch (err) {
            logger.error(`ArticlesManager.get(): ${err}`);

            return null;
        }
    }

    async getAll(): Promise<ArticleDatabaseResult | null> {
        try {
            const connection = await this.getConnection();
            const query = await connection.prepare("SELECT * FROM articles");
            const res: ArticleDatabaseResult = await query.execute();

            await connection.end();

            if (!res[0]) return null;

            return res;
        } catch (err) {
            logger.error(`ArticlesManager.getAll(): ${err}`);

            return null;
        }
    }

    async create({ articleURL, title, content, articleDescription, discordID }: { articleURL: string, title: string; content: string; articleDescription: string; discordID: string }): Promise<ArticleDatabaseResultObject | null> {
        try {
            const connection = await this.getConnection();
            const query = await connection.prepare("INSERT INTO articles (articleURL, title, content, articleDescription, discordID) VALUES (?, ?, ?, ?, ?)");
            const article: OkPacketInterface = await query.execute([ articleURL, title, content, articleDescription, discordID ]);

            await connection.end();

            if (!article.insertId) return null;

            return await this.get(article.insertId);
        } catch (err) {
            logger.error(`ArticlesManager.create(): ${err}`);

            return null;
        }
    }

    async update(id: number, { articleURL, title, content, articleDescription, discordID }: { articleURL: string, title: string; content: string; articleDescription: string; discordID: string }): Promise<ArticleDatabaseResultObject | null> {
        try {
            const connection = await this.getConnection();
            const query = await connection.prepare("UPDATE articles SET articleURL = ?, discordID = ?, title = ?, content = ?, articleDescription = ? WHERE id = ?");
            const res: OkPacketInterface = await query.execute([ articleURL, discordID, title, content, articleDescription, id ]);

            await connection.end();

            if (!res.affectedRows) return null;

            return await this.get(id);
        } catch (err) {
            logger.error(`ArticlesManager.update(): ${err}`);

            return null;
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const connection  = await this.getConnection();
            const query = await connection.prepare("DELETE FROM articles WHERE id = ?");
            const res: OkPacketInterface = await query.execute([ id ]);

            await connection.end();

            if (!res.insertId) return false;

            return true;
        } catch (err) {
            logger.error(`ArticlesManager.delete(): ${err}`);

            return false;
        }
    }
}
