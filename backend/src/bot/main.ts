import { Client as Cl, ClientOptions } from "discord.js"
import PluginHandler from "./handlers/plugin.handler"
import CommandHandler from "./handlers/command.handler"
import logger from "../utils/logger"
import config from "../config"
import { Core } from "../"

export class Client extends Cl {
	public readonly PluginHandler: PluginHandler
	public readonly CommandHandler: CommandHandler
	public readonly Core: Core

	constructor(core: Core, options: ClientOptions) {
		super(options)

		this.Core = core
		this.PluginHandler = new PluginHandler()
		this.CommandHandler = new CommandHandler(this)

		// TODO: przenieść eventy do handlera
		this.on("ready", () => logger.ready("Bot is ready!"))

		this.on("messageCreate", message => {
			if (message.author.bot) return

			if (message.guild) {
				const [commandName, ...args] = message.content
					.slice(config.discord.prefix.length)
					.split(/ +/g)
				const command = this.CommandHandler.get(commandName)

				if (command) {
					command.permissions.forEach(perm => {
						if (!message.member?.permissions.has(perm)) return
					})
					command.exec(this, message, args)
				}
			} else {
			}
		})

		this.login(config.discord.token)
	}
}
