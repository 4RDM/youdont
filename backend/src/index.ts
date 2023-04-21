import { Client } from "./bot/main";
import RCON from "./utils/rcon";
import Database from "./database/database";
import HTTP from "./http/http";
import config from "./config";
import { refreshTops } from "./utils/serverStatus";
import logger from "./utils/logger";

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
	public httpServer: HTTP;
	public database: Database;
	public bot: Client;
	public rcon;
	public cache = new Collection();

	constructor() {
		this.rcon = RCON;
		this.httpServer = new HTTP(this);
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

		this.tops();
	}

	async tops() {
		const status = await refreshTops(this);
		if (!status)
			logger.error("Cannot estabilish first connection with FiveM");

		setInterval(async () => {
			const status = await refreshTops(this);
			if (!status) logger.error("FiveM statisctics cannot be updated");
		}, 120000); // 2m
	}
}

export default new Core();
