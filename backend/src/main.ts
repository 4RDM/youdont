import { Client, ClientOptions, GatewayIntentBits, Partials } from "discord.js";
import config from "config";
import { Database } from "database/database";
import logger from "utils/logger";

interface DatabaseLoginData {
    host: string
    user: string
    port: number
    password: string
    database: string
}

export interface Config {
    botDB: DatabaseLoginData
    fivemDB: DatabaseLoginData
}

export class RDMBot extends Client {
    public config: Config;
    public devMode: boolean;
    public database;

    constructor(options: ClientOptions) {
        super(options);

        this.devMode = process.env.NODE_ENV !== "production";
        this.config = config;

        this.database = new Database(this);

        this.database.testConnection();

        this.database.once("error", () => {
            logger.error("Cannot estabilish connection with database, exiting with code 1");
            process.exit(1);
        });

        this.database.once("ready", () => {
            logger.ready("Database is ready!");
            this.init();
        });
    }

    init() {
        if (this.devMode) {
            logger.warn("Bot is running in development mode");
        }
    }
}

export default new RDMBot({
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