export interface Command {
	triggers: string[]
}

export interface Plugin {
	commands: Command[]
	id: string
	name: string
	description: string
}
