import mongoose from "mongoose";
import { Core } from "../core";
import config from "../config";
import logger from "../utils/logger";
import { UsersManager } from "./managers/users.manager";
import { DonatesManager } from "./managers/donates.manager";
import { ShortsManager } from "./managers/shorts.manager";
import { PlayerDataManager } from "./managers/PlayerData.manager";
import { ArticleManager } from "./managers/articles.manager";
import mariadb from "mariadb";

export default class Database {
	public readonly donates: DonatesManager;
	public readonly users: UsersManager;
	public readonly shorts: ShortsManager;
	public readonly playerData: PlayerDataManager;
	public readonly articles: ArticleManager;
	public readonly mariadb;

	constructor(core: Core) {
		this.donates = new DonatesManager(core);
		this.users = new UsersManager(this);
		this.shorts = new ShortsManager(core);
		this.playerData = new PlayerDataManager();
		this.articles = new ArticleManager();

		// just use fucking mariadb pool everywhere dummy
		this.mariadb = mariadb.createPool({
			host: config.mysql.host,
			user: config.mysql.user,
			password: config.mysql.password,
			port: config.mysql.port,
			database: "rdm",
		});

		mongoose.set("strictQuery", false);

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
			.then(() =>
				logger.ready("Database connection has been established")
			)
			.catch(err => {
				logger.error(`Cannot connect to database, ${err}`);
				process.exit(1);
			});
	}
}
