import { MessageEmbed } from "discord.js"
import { Command } from "../../../../types"

const command: Command = {
	triggers: ["help"],
	description:
		"Sprawdź wszystkie dostępne komendy bota oraz ich zastosowanie",
	async exec(client, message, args) {
		if (args[0]) {
			const command = client.CommandHandler.get(args[0])
			const cat = client.PluginHandler.get(args[0])

			if (!command) {
				if (!cat) return

				const embed = new MessageEmbed()
				embed.setTitle(`${cat.name} ${cat.id}`)
				embed.setDescription(`\`${cat.description}\``)
				embed.setFooter({
					text: `${message.author.tag} (${message.author.id})`,
				})
				embed.setColor("#fcbe03")
				embed.addFields([
					{
						name: "Komendy",
						value: `\`${cat.commands
							.map(com => com.triggers[0])
							.join(", ")}\``,
					},
				])
				embed.setTimestamp(new Date())

				message.channel.send({ embeds: [embed] })

				return
			}

			const permissions = command.permissions
				?.map(p => `\`${p}\``)
				.join(", ")

			const embed = new MessageEmbed()
			embed.setTitle(command.triggers[0])
			embed.setDescription(`\`${command.description}\``)
			embed.setFooter({
				text: `${message.author.tag} (${message.author.id})`,
			})
			embed.setColor("#fcbe03")
			embed.addFields([
				{
					name: "Aliasy",
					value: `\`${command.triggers.join(", ")}\``,
				},
				{
					name: "Poziom dostępu",
					value: `${permissions ? permissions : "`BRAK`"}${
						permissions && command.role
							? ` bądź <@&${command.role}>`
							: ""
					}`,
				},
			])
			embed.setTimestamp(new Date())

			message.channel.send({ embeds: [embed] })
		} else {
			const embed = new MessageEmbed()
			embed.setTitle("Kategorie")
			embed.setFooter({
				text: `${message.author.tag} (${message.author.id})`,
			})
			embed.setColor("#fcbe03")
			embed.setTimestamp(new Date())
			embed.setDescription(
				`\`\`\`${client.PluginHandler.plugins
					.map(p => `${p.name} (ID: ${p.id})`)
					.join("\n")}\`\`\``
			)
			message.channel.send({ embeds: [embed] })
		}
	},
}

module.exports = command
