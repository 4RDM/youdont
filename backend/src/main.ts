import { Client, ClientOptions, GatewayIntentBits, Partials } from "discord.js";
import { Database } from "database/database";
import { EventHandler } from "handlers/events";
import logger from "utils/logger";
import config from "config";
import PluginHandler from "handlers/plugins";
import CommandHandler from "handlers/commands";
import ModalsHandler from "handlers/modals";
import HTTP from "http/http";

interface DatabaseLoginData {
    host: string
    user: string
    port: number
    password: string
    database: string
}

interface DiscordLoginData {
    token: string
    mainGuild: string
    clientId: string
    secret: string
    redirectUri: string
    btDonate: string
    btDev: string
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
    maxPlayers: number
}

interface BotOptions extends ClientOptions {
    disableHTTP?: boolean
}

export class RDMBot extends Client {
    public config: Config;
    public devMode;
    public plugins;
    public commands;
    public database;
    public modals;
    public http;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public embedCache: Map<string, { content: string, channelID: string, time: number }> = new Map();
    public liveCache: Map<string, number> = new Map();
    private rateLimits: Map<string, Map<string, Date>> = new Map();

    constructor(options: BotOptions) {
        super(options);

        this.devMode = process.env.NODE_ENV !== "production";
        this.config = config;

        this.database = new Database(this);
        this.plugins = new PluginHandler();
        this.commands = new CommandHandler(this.plugins);
        this.modals = new ModalsHandler(this.plugins);
        this.http = new HTTP(this);

        this.database.testConnection();

        this.database.once("error", () => {
            logger.error("Cannot estabilish connection with database, exiting with code 1");
            process.exit(1);
        });

        this.database.once("ready", () => {
            logger.ready("Database is ready!");
            this.init();
            this.http.listen();
        });

        setInterval(() => {
            this.embedCache.forEach((value, key) => {
                if (Date.now() > (value.time + 1000 * 60 * 60 * 3)) {
                    this.embedCache.delete(key);
                }
            });
        }, 1000 * 30);
    }

    init() {
        this.plugins.init();

        if (this.devMode)
            logger.warn("Bot is running in development mode");

        new EventHandler(this);

        this.login(config.discord.token);
    }

    getRatelimit(category: string, discordID: string) {
        const ratelimitCategory = this.rateLimits.get(category);

        if (!ratelimitCategory)
            return false;

        const user = ratelimitCategory.get(discordID);

        return user;
    }

    addRateLimit(category: string, discordID: string, miliseconds: number) {
        const ratelimitCategory = this.rateLimits.get(category);

        if (!ratelimitCategory)
            return false;

        return ratelimitCategory.set(discordID, new Date(Date.now() + miliseconds));
    }

    hasExpired(category: string, discordID: string) {
        const rateLimit = this.getRatelimit(category, discordID);

        if (!rateLimit) return false;

        if (Date.now() > rateLimit.getTime()) {
            this.rateLimits.get(category)?.delete(discordID);

            return true;
        }
        else return false;
    }
}

const instance = new RDMBot({
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

export default instance;

process.on("uncaughtException", async (err) => {
    logger.error(`Uncaught exception: ${err}`);

    instance.database.closeAll();
    instance.destroy();

    process.exit(1);
});
