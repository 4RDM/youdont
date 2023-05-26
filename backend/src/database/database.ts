import mongoose from "mongoose";
import { Core } from "../";
import config from "../config";
import logger from "../utils/logger";
import { UsersManager } from "./managers/users.manager";
import { DonatesManager } from "./managers/donates.manager";
import { ShortsManager } from "./managers/shorts.manager";
import { PlayerDataManager } from "./managers/PlayerData.manager";
import { ArticleManager } from "./managers/articles.manager";

export default class Database {
	public readonly donates: DonatesManager;
	public readonly users: UsersManager;
	public readonly shorts: ShortsManager;
	public readonly playerData: PlayerDataManager;
	public readonly articles: ArticleManager;

	constructor(core: Core) {
		this.donates = new DonatesManager(core);
		this.users = new UsersManager();
		this.shorts = new ShortsManager(core);
		this.playerData = new PlayerDataManager();
		this.articles = new ArticleManager();

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
