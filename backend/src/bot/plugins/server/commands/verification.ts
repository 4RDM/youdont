import { Command } from "../../../../types"

const command: Command = {
	triggers: ["setupver"],
	description: "Stwórz wiadomość do weryfikacji",
	permissions: ["ADMINISTRATOR"],
	async exec(client, message, args) {
		message.channel
			.send({
				content:
					"Zweryfikuj się naciskając emoji pod wiadomością! Weryfikując się akceptujesz <#843484880116514830>",
			})
			.then(msg => msg.react("❤️"))
	},
}

module.exports = command
