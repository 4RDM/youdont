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

declare global {
	interface CommandArgs<T = CommandInteraction> {
		client: Client;
		interaction: T;
	}

	interface CommandInfo {
		triggers: string[];
		description: string;
		role?: string;
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

	public readonly core: Core;
	public readonly config = config;
	public readonly logger = logger;
	public noCommands = process.argv.includes("--no-commands");

	constructor(core: Core, options: ClientOptions) {
		super(options);

		this.core = core;
		this.pluginHandler = new PluginHandler();

		if (this.noCommands) {
			this.pluginHandler.plugins = [];
			this.logger.warn(chalk.bgRedBright("Commands are disabled!"));
		}

		this.commandHandler = new CommandHandler(this.pluginHandler);
		this.eventHandler = new EventHandler(this);
		this.modalHandler = new ModalHandler(this);

		this.login(config.discord.token);
	}
}
