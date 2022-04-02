import { Schema, Document, model } from "mongoose";

const schema = new Schema({
	title: String,
	description: String,
	content: String,
	author: {
		nickname: String,
		avatar: String
	},
	id: String,
	views: Number,
	createDate: Date,
});

export interface Article extends Document {
	title: string
	description: string
	content: string
	author: {
		nickname: string
		avatar: string
	}
	id: string
	views: number
	createDate: Date
}

const ArticleModel = model<Article>("articles", schema);

export class ArticleManager {
	async get(id: string): Promise<Article | null> {
		const article = await ArticleModel.findOne({ id });

		if (!article) return null;
		article.views++;
		await article.save();

		return article;
	}
	async getAll(): Promise<Article[] | null> {
		return await ArticleModel.find();
	}
	async update(id: string, document: {
		title: string
		description: string
		content: string
		author: {
			nickname: string
			avatar: string
		}
		id: string
	}): Promise<Article | null> {
		const article = await ArticleModel.findOne({ id });
		if (!article) return null;

		article.title = document.title;
		article.description = document.description;
		article.content = document.content;
		article.author = document.author;
		article.id = document.id;

		await article.save();
		return article;
	}
	async create(document: {
		title: string
		description: string
		content: string
		author: {
			nickname: string
			avatar: string
		}
		id: string
		views: number
		createDate: Date
	}): Promise<Article> {
		return await ArticleModel.create(document);
	}
}