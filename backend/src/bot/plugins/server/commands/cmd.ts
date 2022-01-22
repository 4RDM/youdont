import { Embed } from "../../../../utils/discordEmbed"
import { Command } from "../../../../types"

const command: Command = {
	triggers: ["cmd", "command"],
	description: "Wyślij polecenie do konsoli",
	permissions: ["ADMINISTRATOR"],
	async exec(client, message, args) {
		if (!args[0]) return

		const msg = await message.channel.send({
			embeds: [
				Embed({
					description: "**Wysyłanie**",
					user: message.author,
				}),
			],
		})

		client.Core.rcon.send(
			args.join(" "),
			() => {
				msg.edit({
					embeds: [
						Embed({
							color: "#1F8B4C",
							description: "**Wysłano!**",
							user: message.author,
						}),
					],
				})
			},
			() => {
				msg.edit({
					embeds: [
						Embed({
							color: "#E74C3C",
							description: "**Wystąpił błąd!**",
							user: message.author,
						}),
					],
				})
			}
		)
	},
}

module.exports = command
