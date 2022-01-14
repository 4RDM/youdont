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

		// console.log(this.CommandHandler.get("hello"))
		// console.log(this.CommandHandler.get("world"))
		// console.log(this.CommandHandler.get("helloworld"))

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
					// prettier-ignore
					// message.channel.send(`\`\`\`CP: ${this.ws.ping}ms\nCC: ${Date.now() - message.createdTimestamp}ms\nWS: ${this.ws.ping}, ${this.ws.status}\n\n${command.triggers.join(",")}\n${args.join(",")}\n${commandName}\n\`\`\``)
					command.exec(this, message, args)
				}
			} else {
			}
		})

		this.login(config.discord.token)
	}
}
