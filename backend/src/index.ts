import { Client } from "./bot/main"
import Database from "./database/database"
import HTTP from "./http/http"

export class Core {
	public httpServer: HTTP
	public database: Database
	public bot: Client

	constructor() {
		this.httpServer = new HTTP()
		this.database = new Database()
		this.bot = new Client({
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
