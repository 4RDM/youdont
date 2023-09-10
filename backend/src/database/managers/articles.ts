import { DatabaseCore, OkPacketInterface } from "./database";

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
    constructor(private databaseCore: DatabaseCore) {}

    async getByURL(articleURL: string): Promise<ArticleDatabaseResultObject | null> {
        try {
            const article: ArticleDatabaseResult = await this.databaseCore.botpool.query("SELECT * FROM articles WHERE articleURL = ? LIMIT 1", [articleURL]);

            if (!article[0]) return null;

            this.databaseCore.botpool.query("UPDATE articles SET views = views + 1 WHERE articleURL = ?", [articleURL]);

            return article[0];
        } catch (err) {
            this.databaseCore.core.bot.logger.error(`ArticlesSQL GET Error: ${err}`);

            return null;
        }
    }

    async get(id: number): Promise<ArticleDatabaseResultObject | null> {
        try {
            const article: ArticleDatabaseResult = await this.databaseCore.botpool.query("SELECT * FROM articles WHERE id = ? LIMIT 1", [id]);

            if (!article[0]) return null;

            this.databaseCore.botpool.query("UPDATE articles SET views = views + 1 WHERE id = ?", [id]);

            return article[0];
        } catch (err) {
            this.databaseCore.core.bot.logger.error(`ArticlesSQL GET Error: ${err}`);

            return null;
        }
    }

    async getAll(): Promise<ArticleDatabaseResult | null> {
        try {
            const articles: ArticleDatabaseResult = await this.databaseCore.botpool.query("SELECT * FROM articles");

            if (!articles[0]) return null;

            return articles;
        } catch (err) {
            this.databaseCore.core.bot.logger.error(`ArticlesSQL GETALL Error: ${err}`);

            return null;
        }
    }

    async create({ articleURL, title, content, articleDescription, discordID }: { articleURL: string, title: string; content: string; articleDescription: string; discordID: string }): Promise<ArticleDatabaseResultObject | null> {
        try {
            const article: OkPacketInterface = await this.databaseCore.botpool.query("INSERT INTO articles (articleURL, title, content, articleDescription, discordID) VALUES (?, ?, ?, ?, ?)", [articleURL, title, content, articleDescription, discordID]);

            if (!article.insertId) return null;

            return await this.get(article.insertId);
        } catch (err) {
            this.databaseCore.core.bot.logger.error(`ArticlesSQL CREATE Error: ${err}`);

            return null;
        }
    }

    async update(id: number, { articleURL, title, content, articleDescription, discordID }: { articleURL: string, title: string; content: string; articleDescription: string; discordID: string }): Promise<ArticleDatabaseResultObject | null> {
        try {
            await this.databaseCore.botpool.query("UPDATE articles SET articleURL = ?, discordID = ?, title = ?, content = ?, articleDescription = ? WHERE id = ?", [articleURL, discordID, title, content, articleDescription, id]);

            return await this.get(id);
        } catch (err) {
            this.databaseCore.core.bot.logger.error(`ArticlesSQL UPDATE Error: ${err}`);

            return null;
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const article: OkPacketInterface = await this.databaseCore.botpool.query("DELETE FROM articles WHERE id = ?", [id]);

            if (!article.insertId) return false;

            return true;
        } catch (err) {
            this.databaseCore.core.bot.logger.error(`ArticlesSQL DELETE Error: ${err}`);

            return false;
        }
    }
}
