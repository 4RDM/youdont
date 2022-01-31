import { Command } from "../../../../types"

const command: Command = {
	triggers: ["kick"],
	description: "Wyrzuć osobę",
	permissions: ["BAN_MEMBERS", "KICK_MEMBERS"],
	async exec(client, message, args) {},
}

module.exports = command
