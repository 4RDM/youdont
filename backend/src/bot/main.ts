import { Client as Cl, ClientEvents, ClientOptions } from "discord.js";
import { Core } from "../";
import { Message, PermissionResolvable } from "discord.js";
import config from "../config";
import logger from "../utils/logger";
import PluginHandler from "./handlers/plugin.handler";
import CommandHandler from "./handlers/command.handler";
import EventHandler from "./handlers/event.handler";

declare global {
	interface CommandArgs {
		client: Client;
		message: Message;
		args: string[];
	}

	interface CommandInfo {
		triggers: string[];
		description: string;
		role?: string;
		permissions?: PermissionResolvable[];
	}

	interface Command {
		info: CommandInfo;
		execute({ client, message, args }: CommandArgs): Promise<void>;
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
	public readonly PluginHandler: PluginHandler;
	public readonly CommandHandler: CommandHandler;
	public readonly EventHandler: EventHandler;
	public readonly Core: Core;
	public readonly config = config;
	public readonly logger = logger;

	constructor(core: Core, options: ClientOptions) {
		super(options);

		this.Core = core;
		this.PluginHandler = new PluginHandler();
		this.CommandHandler = new CommandHandler(this.PluginHandler);
		this.EventHandler = new EventHandler(this);

		this.login(config.discord.token);
	}
}
