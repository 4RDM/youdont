import { Message, PermissionResolvable } from "discord.js";
import { Client } from "./bot/main";

export interface CommandArgs {
	client: Client,
	message: Message,
	args: any[]
}

export interface Command {
	info: {
		triggers: string[]
		description: string
		role?: string
		permissions?: PermissionResolvable[]
	},
	execute({ client, message, args }: { client: Client, message: Message, args: string[] }): Promise<void>
}

export interface Plugin {
	commands: Command[]
	id: string
	name: string
	description: string
}
