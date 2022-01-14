import { Command } from "../../../../types"

const command: Command = {
	triggers: ["hello", "helloworld"],
	description: "Testowa komenda",
	permissions: ["ADMINISTRATOR"],
	async exec(client, message, args) {
		message.channel.send("Hello from: " + this.triggers.join(","))
	},
}

module.exports = command
