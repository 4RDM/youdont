import { MessageEmbed } from "discord.js"
import { Command } from "../../../../types"

const command: Command = {
	triggers: ["setupver"],
	description: "Stwórz wiadomość do weryfikacji",
	permissions: ["ADMINISTRATOR"],
	async exec(client, message, args) {
		message.channel
			.send({
				embeds: [
					new MessageEmbed()
						.setColor("#0091ff")
						.setTitle("Weryfikacja")
						.setDescription(
							"Naciśnij emotkę poniżej (:ok:), aby uzyskać dostęp do wszystkich kanałów"
						)
						.setFooter({
							text: `${message.guild?.id} - ${client.user?.id}`,
						})
						.setTimestamp(new Date()),
				],
			})
			.then(msg => msg.react("🆗"))
	},
}

module.exports = command
