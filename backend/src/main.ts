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

        logger.error("TEST");
        logger.log("TEST");
        logger.ready("TEST");
        logger.warn("TEST");
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