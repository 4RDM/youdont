import { Client } from "./bot/main";
import { RCON } from "./utils/rcon";
import Database from "./database/database";
import HTTP from "./http/http";
import config from "./config";
import { Session } from "express-session";

import dotenv from "dotenv";
import { Intents } from "discord.js";
dotenv.config();

declare module "express-serve-static-core" {
	interface Request {
		core: Core;
		session: Session & {
			username?: string;
			userid?: string;
			tag?: string;
			email?: string;
			avatar?: string;
		};
	}
}

export class Core {
	public httpServer: HTTP;
	public database: Database;
	public bot: Client;
	public rcon: RCON;

	constructor() {
		this.rcon = new RCON(config.rcon);
		this.httpServer = new HTTP(this);
		this.database = new Database(this);
		this.bot = new Client(this, {
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MEMBERS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.DIRECT_MESSAGES,
				Intents.FLAGS.GUILD_VOICE_STATES,
				Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
			],
			partials: ["CHANNEL", "GUILD_MEMBER", "USER"],
			presence: {
				status: "idle",
			},
		});
	}
}

export default new Core();
