import { Schema, Document, model } from "mongoose";
import { Core } from "../../";

const schema = new Schema(
	{
		author: String, // id ex. 364056796932997121
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
	active: boolean
	reason: string
	nick: string
	age: number
	voice: number
	long: string
	short: string
	steam: string
	docID?: number
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
		podanie.active = false;
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

	async create(doc: {
		author: string
		nick: string
		age: number
		voice: number
		long: string
		short: string
		steam: string
	}): Promise<Podanie | null> {
		const docID =
			((await DocsModel.findOne().sort({ _id: -1 }))?.docID || 0) + 1;

		return await DocsModel.create({
			docID,
			approver: "",
			reason: "",
			approved: false,
			active: true,
			...doc,
		});
	}

	async remove(docID: string): Promise<Podanie | null> {
		return await DocsModel.findOneAndRemove({ docID });
	}
}
