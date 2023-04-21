import { Command, CommandArgs } from "../../../../types";
import { ErrorEmbed } from "../../../../utils/discordEmbed";

export const execute = async function ({ client, message, args }: CommandArgs) {
	if (!args[0])
		return message.channel.send({
			embeds: [
				ErrorEmbed(message, "Prawidłowe użycie: `.editdonate <ID>`"),
			],
		});

	let donate = await client.Core.database.donates.get(parseInt(args[0]));

	if (!donate)
		return message.channel.send({
			embeds: [ErrorEmbed(message, "Nie znaleziono donate")],
		});

	if (
		!args[1] ||
		!["amount", "userID", "type", "approved", "dID"].includes(args[1])
	)
		return message.channel.send({
			content: `\`\`\`${JSON.stringify(donate)}\`\`\``,
		});
	else if (!args[2])
		return message.channel.send({
			embeds: [ErrorEmbed(message, "Nie podano właściwości do zmiany")],
		});

	if (!isNaN(parseInt(args[2])) && args[1] !== "userID")
		args[2] = parseInt(args[2]);

	// @ts-ignore
	donate[args[1]] = args[2];

	await donate.replaceOne(Object.assign(donate, donate));
	donate = await donate.save();

	if (!donate)
		return message.channel.send({
			embeds: [ErrorEmbed(message, "Nie znaleziono donate")],
		});

	message.channel.send({
		content: `**Zapisano!**\n\`\`\`${JSON.stringify(donate)}\`\`\``,
	});
};

export const info: Command["info"] = {
	triggers: ["editdonate"],
	description: "Zmień właściwości donate",
	permissions: ["Administrator"],
};
