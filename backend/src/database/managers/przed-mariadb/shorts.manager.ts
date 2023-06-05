import { Schema, Document, model } from "mongoose";
import { Core } from "../../../core";
import { nanoid } from "nanoid";

const schema = new Schema(
	{
		shortID: String,
		url: String,
		author: String,
		views: Number,
	},
	{ timestamps: true }
);

export interface Short extends Document {
	shortID: string;
	url: string;
	author: string; // id ex. 364056796932997121
	views: number;
}

const ShortModel = model<Short>("shorts", schema);

export class ShortsManager {
	private readonly core: Core;

	constructor(core: Core) {
		this.core = core;
	}

	async create(options: { author: string; url: string }): Promise<Short> {
		const { author, url } = options;

		return await ShortModel.create({
			author,
			url,
			shortID: nanoid(8),
			views: 0,
		});
	}

	async get(id: string): Promise<string | undefined> {
		const fetched = await ShortModel.findOne({ shortID: id });

		await ShortModel.findOneAndUpdate(
			{ shortID: id },
			{
				views: (fetched?.views || 0) + 1,
			}
		);

		return fetched?.url;
	}
}
