import { Client, ClientOptions, GatewayIntentBits, Partials } from "discord.js";
import { Database } from "database/database";
import { EventHandler } from "handlers/events";
import logger from "utils/logger";
import config from "config";
import PluginHandler from "handlers/plugins";
import CommandHandler from "handlers/commands";

interface DatabaseLoginData {
    host: string
    user: string
    port: number
    password: string
    database: string
}

interface DiscordLoginData {
    token: string
}

interface IndropLoginData {
    key: string
}

interface RconLoginData {
    host: string
    port: number
    password: string
}

export interface Config {
    botDB: DatabaseLoginData
    fivemDB: DatabaseLoginData
    discord: DiscordLoginData
    indrop: IndropLoginData
    rcon: RconLoginData
}

export class RDMBot extends Client {
    public config: Config;
    public devMode;
    public plugins;
    public commands;
    public database;

    constructor(options: ClientOptions) {
        super(options);

        this.devMode = process.env.NODE_ENV !== "production";
        this.config = config;

        this.database = new Database(this);
        this.plugins = new PluginHandler();
        this.commands = new CommandHandler(this.plugins);

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
        this.plugins.init();

        if (this.devMode)
            logger.warn("Bot is running in development mode");

        new EventHandler(this);

        this.login(config.discord.token);
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