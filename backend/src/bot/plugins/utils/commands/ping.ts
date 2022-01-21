import { MessageEmbed } from "discord.js"
import { Command } from "../../../../types"

const command: Command = {
	triggers: ["ping"],
	description: "Sprawdź opóźnienie API bota",
	async exec(client, message, args) {
		const embed = new MessageEmbed()
		embed.setTitle("Ping bota")
		embed.setDescription(
			`\`\`\`API: ${Math.floor(client.ws.ping)}ms\nWiadomość: ${
				Date.now() - message.createdTimestamp
			}ms\`\`\``
		)
		embed.setColor("#fcbe03")
		embed.setTimestamp(new Date())
		embed.setFooter({
			text: `Wywołany przez: ${message.author.tag} (${message.author.id})`,
		})
		message.channel.send({ embeds: [embed] })
	},
}

module.exports = command
