import {
	Client as Cl,
	ClientOptions,
	MessageAttachment,
	MessageEmbed,
	TextChannel,
} from "discord.js"
import PluginHandler from "./handlers/plugin.handler"
import CommandHandler from "./handlers/command.handler"
import isSimilar from "../utils/isSimilar"
import logger from "../utils/logger"
import config from "../config"
import { Core } from "../"
import { join } from "path"
import generateCaptcha from "../utils/generateCaptcha"

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

		let hit = 0 // members joined counter
		let captchaTimeout = setTimeout(() => {}, 0) // timeout to wait
		let captcha = true
		const verificationRole =
			core.database.settings.settings.verificationRole

		// TODO: przenieść eventy do handlera
		this.on("ready", async () => {
			logger.ready("Bot is ready!")

			const channelID =
				core.database.settings.settings.verificationChannel

			const channel = await this.channels.fetch(channelID)
			logger.warn(`Cached verification channel: ${channelID}`)

			if (channel?.isText()) {
				const lastMessage = await channel.messages.fetch()
				logger.warn(
					`Cached last message on verification channel: ${
						lastMessage.last()?.id
					}`
				)
			}
		})

		this.on("guildMemberAdd", () => {
			hit++
			captchaTimeout = setTimeout(() => {
				if (hit >= 4) {
					hit = 0
					captcha = true
					;(<TextChannel>(
						this.channels.cache.get("853743241080995850")
					)).send({
						embeds: [
							new MessageEmbed()
								.setTitle("Automoderator")
								.setDescription(
									"Wykryto potencjalne zagrożenie raidem, captcha uruchomiona"
								)
								.setTimestamp(new Date()),
						],
					})
				}
			}, 20000)
		})

		this.on("messageReactionAdd", async (reaction, user) => {
			if (!reaction.message.guild) return

			// prettier-ignore
			if (reaction.message.embeds[0].footer?.text == `${reaction.message.guild.id} - ${this.user?.id}` && user.id !== this.user?.id) {
				const userReactions = reaction.message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
				for (const reaction of userReactions.values()) {
					await reaction.users.remove(user.id);
				}

				if (!captcha)
					reaction.message.guild.members.cache
						.get(user.id)
						?.roles.add(verificationRole)
				else {
					const code = await generateCaptcha(user.id)
					const message = await user.send({
						embeds: [
							new MessageEmbed()
								.setTitle("Captcha")
								.setColor("#0091ff")
								.setDescription(
									"Captcha jest uruchomiona, aby kontynuować przepisz kod z obrazka poniżej w nowej wiadomości."
								).setImage(`attachment://${user.id}.captcha.jpg`),
						],
						files: [join(__dirname, "..", "..", "images", `${user.id}.captcha.jpg`)]
					})

					const collector = await message.channel.awaitMessages({
						filter: (collected => collected.author.id === user.id),
						max: 1,
						time: 15000,
					}).catch(() => {
						user.send("Czas na weryfikację minął")
					})

					if (typeof collector !== "undefined") {
						if (collector.first()?.content == code) {
							reaction.message.guild.members.cache.get(user.id)?.roles.add(verificationRole)
							user.send('Zweryfikowano pomyślnie!')
						} {
							user.send('Nieprawidłowy kod')
						}
					}
				}
			}
		})

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
