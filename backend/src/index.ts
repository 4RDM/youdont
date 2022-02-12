import { Client } from "./bot/main"
import { RCON } from "./utils/rcon"
import Database from "./database/database"
import HTTP from "./http/http"
import config from "./config"
import { Session } from "express-session"

import dotenv from "dotenv"
dotenv.config()

declare module "express-serve-static-core" {
	interface Request {
		core: Core
		session: Session & {
			username?: string
			userid?: string
			tag?: string
			email?: string
			avatar?: string
		}
	}
}

export class Core {
	public httpServer: HTTP
	public database: Database
	public bot: Client
	public rcon: RCON

	constructor() {
		this.rcon = new RCON(config.rcon)
		this.httpServer = new HTTP(this)
		this.database = new Database(this)
		this.bot = new Client(this, {
			intents: [
				"DIRECT_MESSAGES",
				"GUILDS",
				"GUILD_MEMBERS",
				"GUILD_MESSAGE_REACTIONS",
				"GUILD_MESSAGES",
				"DIRECT_MESSAGE_REACTIONS",
				"GUILD_PRESENCES",
				"GUILD_WEBHOOKS",
				"GUILD_BANS",
			],
			partials: ["CHANNEL", "GUILD_MEMBER", "USER"],
		})
	}
}

export default new Core()
