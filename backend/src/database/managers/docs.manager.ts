import { User } from "discord.js";
import { Schema, Document, model } from "mongoose";
import { Embed } from "../../utils/discordEmbed";
import { Core } from "../../";

const schema = new Schema(
	{
		author: String, // id ex. 364056796932997121
		docID: String,
		date: Date,
		approver: String,
		approved: Boolean,
		active: Boolean,
		reason: String,
		nick: String,
		age: Number,
		voice: Number,
		long: String,
		short: String,
		steam: String,
	},
	{ timestamps: true }
);

export interface Podanie extends Document {
	author: string // id ex. 364056796932997121
	approver: string
	approved: boolean
	date: Date
	active: boolean
	reason: string
	nick: string
	age: number
	voice: number
	long: string
	short: string
	steam: string
	docID?: string
}

const DocsModel = model<Podanie>("podania", schema);

export class DocsManager {
	private readonly core: Core;

	constructor(core: Core) {
		this.core = core;
	}

	async get(docID: string): Promise<Podanie | null> {
		return await DocsModel.findOne({ docID });
	}

	async changeState(docID: string, approved: boolean, approver: string, reason?: string): Promise<Podanie | null> {
		let podanie = await DocsModel.findOne({ docID });
		if (!podanie) return null;

		podanie.approved = approved;
		podanie.approver = approver;
		if (!podanie.approved && reason) podanie.reason = reason;

		await podanie.save();
		podanie = await DocsModel.findOne({ docID });

		return podanie;
	}

	async getAll(): Promise<Podanie[] | null> {
		return await DocsModel.find();
	}

	async getAllUser(userID: string): Promise<Podanie[] | null> {
		return await DocsModel.find({ author: userID });
	}

	async getAllActive(): Promise<Podanie[] | null> {
		return await DocsModel.find({ active: true });
	}

	async publishResults(userID: string) {
		const activeApplications = await this.getAllActive();
		const channel = this.core.bot.channels.cache.get("843444754922602546");
		if (!activeApplications || !channel?.isText()) return;

		activeApplications.forEach(async (application) => {
			application.active = false;
			await application.save();
		});
		
		channel.send({ embeds: [
			Embed({
				title: `Wyniki podań (${userID})`,
				description: ":hourglass: Czas sprawdzić wyniki podań! [Panel](https://4rdm.pl/panel)",
				user: <User>this.core.bot.user,
			})
		] });
	}

	async create(doc: {
		author: string
		nick: string
		age: number
		voice: number
		long: string
		short: string
		steam: string
	}): Promise<Podanie | null> {
		const docID = parseInt(((await DocsModel.findOne().sort({ _id: -1 }))?.docID || "0")) + 1;

		return await DocsModel.create({
			docID,
			approver: "",
			reason: "",
			approved: false,
			active: true,
			date: new Date(),
			...doc,
		});
	}

	async remove(docID: string): Promise<Podanie | null> {
		return await DocsModel.findOneAndRemove({ docID });
	}
}
