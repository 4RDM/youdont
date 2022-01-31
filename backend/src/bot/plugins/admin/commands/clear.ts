import { Embed } from "../../../../utils/discordEmbed"
import { Command } from "../../../../types"
import { TextChannel } from "discord.js"

const command: Command = {
	triggers: ["clear", "purge", "wyczysc"],
	description: "Usuwa określoną ilość wiadomości",
	permissions: ["MANAGE_MESSAGES"],
	async exec(client, message, args) {
		if (
			!args[0] ||
			isNaN(parseInt(args[0])) ||
			parseInt(args[0]) > 100 ||
			parseInt(args[0]) < 0
		)
			return message.channel.send({
				embeds: [
					Embed({
						color: "#E74C3C",
						title: "Błąd składni polecenia",
						description:
							"```Brakuje parametru 'ilosc (0>number<100)',\nPrawidłowe użycie: .clear ilosc-wiadomosci```",
						user: message.author,
					}),
				],
			})

		const messages = await message.channel.messages.fetch({
			limit: parseInt(args[0]),
		})

		try {
			await (<TextChannel>message.channel).bulkDelete(messages)
			message.channel.send({
				embeds: [
					Embed({
						color: "#1F8B4C",
						title: ":broom: Brooooom",
						description: `Usunięto **${args[0]}** wiadomości!`,
						user: message.author,
					}),
				],
			})
		} catch (err) {
			message.channel.send({
				embeds: [
					Embed({
						color: "#E74C3C",
						title: ":broom: Brooooom",
						description: `**Wystąpił błąd podczas usuwania wiadomości**`,
						user: message.author,
					}),
				],
			})
		}
	},
}

module.exports = command
