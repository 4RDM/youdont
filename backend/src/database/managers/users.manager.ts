import mariadb from "mariadb";
import config from "../../config";
import { model, Schema } from "mongoose";
import { Donate } from "./donates.manager";

type DBUser = null | IUser;
interface IUser {
	identifier: string;
	license: string;
	discord: string;
	deaths: number;
	heady: number;
	kills: number;
}

interface User {
	userID: string
	role: string
	total: number
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	donates: any
}

const UserModel = model<User>("users", new Schema<User>(
	{
		userID: { type: String, required: true , unique: true },
		role: { type: String, required: true },
		total: { type: Number, required: true },
		donates: { type: Array, required: true }
	}, { timestamps: true }
));

export class UsersManager {
	async get(userID: string): Promise<User | null> {
		return await UserModel.findOne({ userID });
	}

	async create(userID: string): Promise<User> {
		const document = new UserModel({ userID, total: 0, role: "Członek", donates: {} });
		await document.save();

		return document;
	}

	async createIfNotExists(userID: string): Promise<User> {
		let user = await this.get(userID);

		if (user) return user;
		else user = await this.create(userID);

		return user;
	}

	async addDonate(userID: string, donate: Donate) {
		const document = await UserModel.findOne({ userID });
		const donates = { ...document?.donates };

		donates[donates.length + 1] = donate.amount;

		UserModel.findOneAndUpdate({ userID }, {
			donates
		});
	}

	async getUserFromServer(discord: string): Promise<DBUser | null> {
		const connection = await mariadb.createConnection({
			host: config.mysql.host,
			user: config.mysql.user,
			password: config.mysql.password,
			database: "rdm",
			allowPublicKeyRetrieval: true,
		});

		const response: DBUser = (
			await connection.query(
				`SELECT * FROM kdr WHERE \`discord\` = '${discord}'`
			)
		)[0];

		return response;
	}
}
