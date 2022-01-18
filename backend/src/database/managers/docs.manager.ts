import { Schema, Document, model } from "mongoose"
import { Core } from "../../"

const schema = new Schema(
	{
		author: String, // id ex. 364056796932997121
		nick: String,
		age: Number,
		voice: Number,
		long: String,
		short: String,
		steam: String,
	},
	{ timestamps: true }
)

export interface Podanie extends Document {
	author: string // id ex. 364056796932997121
	nick: string
	age: number
	voice: number
	long: string
	short: string
	steam: string
	docID?: number
}

const DocsModel = model<Podanie>("podania", schema)

export class DocsManager {
	private readonly core: Core

	constructor(core: Core) {
		this.core = core
	}

	async get(docID: number): Promise<Podanie | null> {
		return await DocsModel.findOne({ docID })
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
			((await DocsModel.findOne().sort({ _id: -1 }))?.docID || 0) + 1

		return await DocsModel.create({
			docID,
			...doc,
		})
	}
}
