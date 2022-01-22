import { MessageEmbed } from "discord.js"
import { Command } from "../../../../types"

const command: Command = {
	triggers: ["cmd"],
	description: "Wyślij polecenie do konsoli",
	permissions: ["ADMINISTRATOR"],
	async exec(client, message, args) {
		if (!args[0]) return

		const msg = await message.channel.send({
			embeds: [
				new MessageEmbed()
					.setDescription("Wysyłanie")
					.setTimestamp(new Date()),
			],
		})

		try {
			client.Core.rcon.send(args.join(" "))
		} catch (err) {
			msg.edit({
				embeds: [
					new MessageEmbed()
						.setDescription("Wystąpił błąd!")
						.setTimestamp(new Date()),
				],
			})
		}
	},
}

module.exports = command
