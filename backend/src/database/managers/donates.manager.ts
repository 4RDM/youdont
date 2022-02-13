import { Schema, Document, model } from "mongoose";
import { Core } from "../../";

const schema = new Schema(
	{
		docID: Number,
		userID: String,
		userTag: String,
		userSteam: String,
		userAge: Number,
		shortDescription: String,
		longDescription: String,
	},
	{ timestamps: true }
);

export interface Donate extends Document {
	dID: number
	userID: string
	amount: number
	timestamp: Date
	type: "psc" | "paypal" | "tipply"
	approved: boolean
	approver: string
}

const DonateModel = model<Donate>("donates", schema);

export class DonatesManager {
	private readonly core: Core;

	constructor(core: Core) {
		this.core = core;
	}
}
