import {
    Client as Cl,
    ClientEvents,
    ClientOptions,
    SlashCommandBuilder,
    PermissionResolvable,
    CommandInteraction,
    AutocompleteInteraction,
} from "discord.js";
import { Core } from "../core";
import config from "../config";
import logger from "../utils/logger";
import PluginHandler from "./handlers/plugin";
import CommandHandler from "./handlers/command";
import EventHandler from "./handlers/event";
import { ModalHandler } from "./handlers/modal";
import chalk from "chalk";
import { IndropManager } from "utils/indrop";

declare global {
    interface CommandArgs<T = CommandInteraction> {
        client: Client;
        interaction: T;
    }

    interface CommandInfo {
        triggers: string[];
        description: string;
        role?: string[];
        permissions?: PermissionResolvable;
        builder: SlashCommandBuilder;
    }

    interface Command {
        info: CommandInfo;
        execute({ client, interaction }: CommandArgs): Promise<void>;
        autocomplete?(
            client: Client,
            interaction: AutocompleteInteraction
        ): Promise<void>;
    }

    interface EventInfo {
        eventName: keyof ClientEvents;
    }

    interface EventHandle<T extends keyof ClientEvents> {
        info: EventInfo;
        execute({}: ClientEvents[T]): Promise<void>;
    }

    type ClientType = Client;
}

export class Client extends Cl {
    public readonly pluginHandler: PluginHandler;
    public readonly commandHandler: CommandHandler;
    public readonly eventHandler: EventHandler;
    public readonly modalHandler: ModalHandler;
    public readonly paymentHandler: IndropManager;
    private rateLimits: Map<string, Map<string, Date>> = new Map();

    public readonly config = config;
    public readonly logger = logger;
    public noCommands = process.argv.includes("--no-commands");

    constructor(public readonly core: Core, options: ClientOptions) {
        super(options);

        this.paymentHandler = new IndropManager(this.config.indropkey);

        this.pluginHandler = new PluginHandler();

        if (this.noCommands) {
            this.pluginHandler.plugins = [];
            this.logger.warn(chalk.bgRedBright("Commands are disabled!"));
        }

        this.commandHandler = new CommandHandler(this.pluginHandler);
        this.eventHandler = new EventHandler(this);
        this.modalHandler = new ModalHandler();

        this.rateLimits.set("unban", new Map());

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

        console.log(category, discordID, new Date(Date.now() + miliseconds));

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
