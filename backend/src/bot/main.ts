import { Client as Cl, ClientOptions } from "discord.js"
import PluginHandler from "./handlers/plugin.handler"
import CommandHandler from "./handlers/command.handler"
import isSimilar from "../utils/isSimilar"
import logger from "../utils/logger"
import config from "../config"
import { Core } from "../"

const wordlist = [
	{
		msg: "gdzie kupić donator",
		res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/article-wplata-na-serwer",
	},
	{
		msg: "gdzie kupić partner",
		res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/article-wplata-na-serwer",
	},
	{
		msg: "co daje mi partner",
		res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/article-wplata-na-serwer",
	},
	{
		msg: "co daje mi donator",
		res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/article-wplata-na-serwer",
	},
	{
		msg: "jak kupić partner",
		res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/article-wplata-na-serwer",
	},
	{
		msg: "jak kupić donator",
		res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/article-wplata-na-serwer",
	},
]

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

			if (!message.content.startsWith(config.discord.prefix)) {
				wordlist.forEach(word => {
					if (isSimilar(message.content, word.msg)) {
						message.reply(word.res)
						return
					}
				})

				return
			}

			if (message.guild) {
				const [commandName, ...args] = message.content
					.slice(config.discord.prefix.length)
					.split(/ +/g)
				const command = this.CommandHandler.get(commandName)

				if (command) {
					command.permissions.forEach(perm => {
						if (!message.member?.permissions.has(perm))
							return message.react(":x:")
					})
					command.exec(this, message, args)
				}
			} else {
				/* handle dms */
			}
		})

		this.login(config.discord.token)
	}
}
