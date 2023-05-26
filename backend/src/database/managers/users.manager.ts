import { model, Schema, Document } from "mongoose";
import { Donate } from "./donates.manager";
import Database from "../database";
import logger from "../../utils/logger";

type DBUser = null | IUser;

interface IUser {
	identifier: string;
	license: string;
	discord: string;
	deaths: number;
	heady: number;
	kills: number;
}

interface Notatka {
	id: string;
	content: string;
	authorID: string;
	date: number;
}

interface UUser extends Document {
	userID: string;
	role: string;
	total: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	donates: any;
	notatki: Array<Notatka>;
}

const UserModel = model<UUser>(
	"users",
	new Schema<UUser>(
		{
			userID: { type: String, required: true, unique: true },
			role: { type: String, required: true },
			total: { type: Number, required: true },
			donates: { type: Array, required: true },
			notatki: { type: Schema.Types.Mixed, required: true },
		},
		{ timestamps: true }
	)
);

export class UsersManager {
	private manager: Database;

	constructor(manager: Database) {
		this.manager = manager;
	}

	async get(userID: string): Promise<UUser | null> {
		const user = await UserModel.findOne({ userID });
		return user;
	}

	async approve(userID: string, donate: Donate): Promise<UUser | null> {
		let user = await UserModel.findOne({ userID });
		if (!user) return null;
		user = await UserModel.findOneAndUpdate(
			{ userID },
			{ total: user.total + (donate.amount || 0) }
		).exec();
		user = await UserModel.findOne({ userID });
		return user;
	}

	async create(userID: string): Promise<UUser> {
		const document = new UserModel({
			userID,
			total: 0,
			role: "Członek",
			donates: {},
		});
		await document.save();

		return document;
	}

	async createIfNotExists(userID: string): Promise<UUser> {
		let user = await this.get(userID);

		if (user) return user;
		else user = await this.create(userID);

		return user;
	}

	async getUserFromServer(discord: string): Promise<DBUser | null> {
		try {
			if (!this.manager.mariadb) return null;

			const connection = await this.manager.mariadb.getConnection();

			const response: DBUser = (
				await connection.query(
					`SELECT * FROM kdr WHERE \`discord\` = '${discord}'`
				)
			)[0];

			connection.end();

			return response;
		} catch (err) {
			logger.error(`MariaDB returned an error: ${err}`);
			return null;
		}
	}
}
