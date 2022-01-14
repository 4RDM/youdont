import { Client as Cl, ClientOptions } from "discord.js"
import PluginHandler from "./handlers/plugin.handler"
import CommandHandler from "./handlers/command.handler"
import logger from "../utils/logger"
import config from "../config"

export class Client extends Cl {
	public readonly PluginHandler: PluginHandler
	public readonly CommandHandler: CommandHandler

	constructor(options: ClientOptions) {
		super(options)

		this.PluginHandler = new PluginHandler()
		this.CommandHandler = new CommandHandler(this)

		console.log(this.CommandHandler.get("hello"))
		console.log(this.CommandHandler.get("world"))
		console.log(this.CommandHandler.get("helloworld"))

		// TODO: przenieść eventy do handlera
		this.on("ready", () => logger.ready("Bot is ready!"))

		this.login(config.discord.token)
	}
}
