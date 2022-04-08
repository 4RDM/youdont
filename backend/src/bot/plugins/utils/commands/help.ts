import { Embed } from "../../../../utils/discordEmbed";
import { CommandArgs } from "../../../../types";

export const execute = async function({ client, message, args }: CommandArgs) {
	if (args[0]) {
		const command = client.CommandHandler.get(args[0]);
		const cat = client.PluginHandler.get(args[0]);

		if (!command) {
			if (!cat) return;

			const embed = Embed({
				title: `${cat.name} ${cat.id}`,
				description: `\`${cat.description}\``,
				fields: [
					{
						name: "Komendy",
						value: `\`${cat.commands
							.map(com => com.info.triggers[0])
							.join(", ")}\``,
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
				},
				{
					name: "Poziom dostępu",
					value: `${permissions ? permissions : "`BRAK`"}${
						permissions && command.info.role
							? ` bądź <@&${command.info.role}>`
							: ""
					}`,
				},
			],
		});

		message.channel.send({ embeds: [embed] });
	} else {
		const embed = Embed({
			title: "Kategorie",
			description: `\`\`\`${client.PluginHandler.plugins
				.map(p => `${p.name} (ID: ${p.id})`)
				.join("\n")}\`\`\``,
			user: message.author,
		});

		message.channel.send({ embeds: [embed] });
	}
};

export const info = {
	triggers: ["help"],
	description: "Sprawdź wszystkie dostępne komendy bota oraz ich zastosowanie",
};