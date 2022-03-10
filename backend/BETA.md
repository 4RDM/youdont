New command handler specification
```ts
//
// Command interface renamed to CommandInfo
// This will make rewriting old commands harder
//
export interface CommandInfo {
	triggers: string[]
	description: string
	role?: string
	permissions?: PermissionResolvalbe[]
}

//
// New BotInput interface
//
export interface BotInput {
	client: ClientUser
	message: Message
	args: string[]
}

//
// Command example
// NOTE: no exec function inside CommandInfo
//
module.execute = async function({ client, message, args }: BotInput) {
	await message.channel.send(args.join(" "));
}

module.info = {
	triggers: ["help", "pomoc"],
	description: "Test command",
	role: "123123123123123",
}

```