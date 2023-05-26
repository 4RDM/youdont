import { Client } from "./bot/main";
import RCON from "./utils/rcon";
import Database from "./database/database";
import HTTP from "./http/http";

import dotenv from "dotenv";
import { Collection, GatewayIntentBits, Partials } from "discord.js";
import { Session } from "express-session";

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
	public httpServer: HTTP | null;
	public database: Database;
	public bot: Client;
	public rcon;
	public cache = new Collection();

	constructor(options?: { disableHTTP?: boolean }) {
		this.rcon = RCON;

		if (!options?.disableHTTP) this.httpServer = new HTTP(this);
		else this.httpServer = null;

		this.database = new Database(this);
		this.bot = new Client(this, {
			intents: [
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildMessageReactions,
			],
			partials: [
				Partials.Channel,
				Partials.GuildMember,
				Partials.User,
				Partials.Message,
			],
			presence: {
				status: "idle",
			},
		});
	}
}
