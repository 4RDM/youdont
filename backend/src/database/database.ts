import mongoose from "mongoose"
import { DocsManager } from "./managers/docs.manager"
import { UsersManager } from "./managers/users.manager"
import { DonatesManager } from "./managers/donates.manager"
import logger from "../utils/logger"
import config from "../config"
import { Core } from "../"

export default class Database {
	public readonly donates: DonatesManager
	public readonly users: UsersManager
	public readonly docs: DocsManager

	constructor(core: Core) {
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
			.then(() => logger.ready("Database ready"))
			.catch(err => logger.error(`Cannot connect to database, ${err}`))
	}
}
