import { Embed } from "../../../../utils/discordEmbed";
import { EmbedField } from "discord.js";

export const execute = async function ({ client, message, args }: CommandArgs) {
	if (args[0]) {
		const command = client.CommandHandler.get(args[0]);
		const cat = client.PluginHandler.get(args[0]);

		if (!command) {
			if (!cat) return;

			const embed = Embed({
				title: `${cat.name}`,
				fields: [
					{
						name: "Komendy",
						value: `\`${cat.commands
							.map(com => com.info.triggers[0])
							.join(", ")}\``,
						inline: false,
					},
				],
				user: message.author,
			});

			message.channel.send({ embeds: [embed] });

			return;
		}

		const permissions = command.info.permissions
			?.map(p => `\`${p}\``)
			.join(", ");

		const embed = Embed({
			title: command.info.triggers[0],
			description: `\`${command.info.description}\``,
			user: message.author,
			fields: [
				{
					name: "Aliasy",
					value: `\`${command.info.triggers.join(", ")}\``,
					inline: false,
				},
				{
					name: "Poziom dostępu",
					value: `${permissions ? permissions : "`BRAK`"}${
						permissions && command.info.role
							? ` bądź <@&${command.info.role}>`
							: ""
					}`,
					inline: false,
				},
			],
		});

		message.channel.send({ embeds: [embed] });
	} else {
		const fields: EmbedField[] = [];

		client.PluginHandler.plugins.forEach(plugin => {
			fields.push({
				name: `${plugin.name}`,
				value: `**ID:** ${plugin.id}\n\`\`\`${plugin.description}\`\`\``,
				inline: true,
			});
		});

		const embed = Embed({
			title: "Kategorie",
			fields: fields,
			user: message.author,
		});

		message.channel.send({ embeds: [embed] });
	}
};

export const info: CommandInfo = {
	triggers: ["help"],
	description:
		"Sprawdź wszystkie dostępne komendy bota oraz ich zastosowanie",
};
