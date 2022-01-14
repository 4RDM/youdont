import { Message, PermissionResolvable } from "discord.js"
import { Client } from "./bot/main"

export interface Command {
	triggers: string[]
	description: string
	permissions: PermissionResolvable[]
	exec(client: Client, message: Message, args: string[]): void
}

export interface Plugin {
	commands: Command[]
	id: string
	name: string
	description: string
}
