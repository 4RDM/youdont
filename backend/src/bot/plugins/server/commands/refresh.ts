import { Embed } from "../../../../utils/discordEmbed"
import { Command } from "../../../../types"

const command: Command = {
	triggers: ["refresh"],
	description: "Przeładuj uprawnienia na serwerze",
	permissions: ["ADMINISTRATOR"],
	role: "843444626726584370", // ZARZĄD
	async exec(client, message, args) {
		const msg = await message.channel.send({
			embeds: [
				Embed({
					description: "**Wysyłanie**",
					user: message.author,
				}),
			],
		})

		client.Core.rcon.send(
			"exec permisje.cfg",
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
