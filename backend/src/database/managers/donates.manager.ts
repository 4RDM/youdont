import { Schema, model } from "mongoose";
import { Core } from "../../";
export interface Donate {
	dID?: number;
	amount?: number;
	approved?: boolean;
	approver?: string;
	userID: string;
	timestamp: Date;
	type: "psc" | "paypal" | "tipply";
}

const DonateModel = model<Donate>("donates", new Schema<Donate>(
	{
		dID: { type: Number, required: true, unique: true },
		userID: { type: String, required: true },
		amount: { type: Number, required: false },
		timestamp: { type: Date, required: true },
		type: { type: String, required: true },
		approved: { type: Boolean, required: false },
		approver: { type: String, required: false },
	}, { timestamps: true }
));

export class DonatesManager {
	private readonly core: Core;

	constructor(core: Core) { this.core = core; }

	async get(donateID: number): Promise<Donate | null> {
		return await DonateModel.findOne({ dID: donateID });
	}

	async create({ userID, timestamp, type }: Donate): Promise<Donate> {
		if (!(await this.core.database.users.get(userID))) await this.core.database.users.create(userID);

		const lastDocument = await DonateModel.findOne().sort({ _id: -1 });
		const newID = (lastDocument?.dID || 0) + 1;

		const document = new DonateModel({ userID, amount: 0, type, timestamp, approved: false, approver: "", dID: newID });
		await document.save();

		await this.core.database.users.addDonate(userID, document);

		return document;
	}

	async approve(donateID: number, approver: string, amount: string): Promise<Donate | null> {
		const document =  await DonateModel.findOneAndUpdate({ dID: donateID }, { approved: true, approver, amount });

		document?.save();

		return document;
	}
}
