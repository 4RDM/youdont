import { Client } from "./bot/main"
// import { RCON } from "./utils/rcon"
// import config from "./config"
import Database from "./database/database"
import HTTP from "./http/http"

declare module "express-serve-static-core" {
	interface Request {
		core: Core
	}
}

export class Core {
	public httpServer: HTTP
	public database: Database
	public bot: Client

	constructor() {
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

// const rcon = new RCON(config.rcon)
// rcon.send("reloadchat")

export default new Core()
