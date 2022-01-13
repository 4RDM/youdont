import { DocsManager } from "./managers/docs.manager"
import { UsersManager } from "./managers/users.manager"
import { DonatesManager } from "./managers/donates.manager"
import logger from "src/utils/logger"
import mongoose from "mongoose"
import config from "src/config"

export default class Database {
	public readonly donates: DonatesManager
	public readonly users: UsersManager
	public readonly docs: DocsManager

	constructor() {
		// prettier-ignore
		this.donates = new DonatesManager()
		this.users = new UsersManager()
		this.docs = new DocsManager()

		mongoose
			.connect(
				`mongodb://${config.mongodb.ip}:${config.mongodb.port}/${config.mongodb.database}`,
				{
					user: config.mongodb.username,
					pass: config.mongodb.password,
					authSource: config.mongodb.auth,
					autoCreate: true,
				}
			)
			.then(() => logger.ready("Database connected"))
			.catch(err => logger.error(`Cannot connect to database, ${err}`))
	}
}
