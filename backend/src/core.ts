import { Collection, GatewayIntentBits, Partials } from "discord.js";
import { Session } from "express-session";
import { Client } from "./bot/main";
import { DatabaseCore } from "./database/managers/database";
import RCON from "./utils/rcon";
import HTTP from "./http/http";
import dotenv from "dotenv";

dotenv.config();

declare module "express-serve-static-core" {
	interface Request {
		core: Core;
		skip: boolean;
		session: Session & {
			username?: string;
			userid?: string;
			tag?: string;
			email?: string;
			avatar?: string;
		};
	}
}

declare module "discord.js" {
    interface BaseInteraction {
        hasReplied: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Reply: (options: string | EmbedBuilder | MessagePayload | InteractionReplyOptions) => Promise<Message<boolean> | InteractionResponse<boolean> | undefined>;
    }
}

export class Core {
    public httpServer: HTTP | null;
    public database: DatabaseCore;
    public bot: Client;
    public rcon = RCON;
    public cache = new Collection();

    constructor(options: { disableHTTP: boolean }) {
        if (!options.disableHTTP) this.httpServer = new HTTP(this);
        else this.httpServer = null;

        this.database = new DatabaseCore(this);

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
