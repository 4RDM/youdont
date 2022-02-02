import { Client as Cl, ClientOptions, MessageEmbed, User } from "discord.js"
import PluginHandler from "./handlers/plugin.handler"
import CommandHandler from "./handlers/command.handler"
import isSimilar from "../utils/isSimilar"
import logger from "../utils/logger"
import { Embed } from "../utils/discordEmbed"
import config from "../config"
import { Core } from "../"
import { join } from "path"
import generateCaptcha from "../utils/generateCaptcha"
import { unlinkSync } from "fs"
import { checkMessage } from "./handlers/automoderator.handler"

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
		let captcha = false
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
			clearTimeout(captchaTimeout)

			captchaTimeout = setTimeout(() => {
				hit = 0
			}, 12000)

			// 6 members
			if (hit >= 5 && !captcha) {
				const channel = this.channels.cache.get("937813027007385630")

				// prettier-ignore
				if (channel?.isText() && !captcha) channel.send({ embeds: [ Embed({ title: "Automoderator", color: "#E74C3C", description: "Wykryto potencjalne zagrożenie raidem, captcha uruchomiona", user: <User>this.user }) ]})

				captcha = true
				setTimeout(() => (captcha = false), 1000 * 60 * 60)
			}

			hit++
		})

		this.on("messageReactionAdd", async (reaction, user) => {
			if (!reaction.message.guild) return

			if (
				reaction.message.channelId ==
					core.database.settings.settings.verificationChannel &&
				reaction.emoji.name == "❤️"
			) {
				const userReactions = reaction.message.reactions.cache.filter(
					reaction => reaction.users.cache.has(user.id)
				)
				for (const reaction of userReactions.values()) {
					await reaction.users.remove(user.id)
				}

				if (!captcha)
					reaction.message.guild.members.cache
						.get(user.id)
						?.roles.add(verificationRole)
				else {
					const code = await generateCaptcha(user.id)
					const captchaFile = join(
						__dirname,
						"..",
						"..",
						"images",
						`${user.id}.captcha.jpg`
					)
					user.send({
						embeds: [
							new MessageEmbed()
								.setTitle("Captcha")
								.setColor("#0091ff")
								.setDescription(
									"Captcha jest uruchomiona, aby kontynuować przepisz kod z obrazka poniżej w nowej wiadomości."
								)
								.setImage(
									`attachment://${user.id}.captcha.jpg`
								),
						],
						files: [captchaFile],
					})
						.then(async message => {
							await message.channel
								.awaitMessages({
									filter: collected =>
										collected.author.id === user.id,
									max: 1,
									time: 15000,
								})
								.then(collection => {
									if (collection.first()?.content == code) {
										reaction.message.guild?.members.cache
											.get(user.id)
											?.roles.add(verificationRole)
										user.send("Zweryfikowano pomyślnie!")
									}
								})
								.catch(() => {
									user.send("Czas na weryfikację minął")
								})

							unlinkSync(captchaFile)
						})
						.catch(() => {
							logger.error(
								`Cannot send message to ${user.id} (${user.tag})`
							)
							unlinkSync(captchaFile)
						})
				}
			}
		})

		this.on("messageCreate", message => {
			if (message.author.bot) return

			if (!message.content.startsWith(config.discord.prefix)) {
				checkMessage(message.content).then(s => {
					if (s) {
						message.channel.send(
							"wth bro, what is this shit? are you crazy?"
						)
					}
				})
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
					// prettier-ignore
					if (
						(command.role && message.member?.roles.cache.has(command.role)) ||
						message.member?.permissions.has(command.permissions || [])
					) command.exec(this, message, args)
					else message.react("❌")
				}
			} else {
				/* handle dms */
			}
		})

		this.login(config.discord.token)
	}
}
