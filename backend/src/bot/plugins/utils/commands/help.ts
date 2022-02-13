import { Embed } from "../../../../utils/discordEmbed";
import { Command } from "../../../../types";

const command: Command = {
	triggers: ["help"],
	description:
		"Sprawdź wszystkie dostępne komendy bota oraz ich zastosowanie",
	async exec(client, message, args) {
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
								.map(com => com.triggers[0])
								.join(", ")}\``,
						},
					],
					user: message.author,
				});

				message.channel.send({ embeds: [embed] });

				return;
			}

			const permissions = command.permissions
				?.map(p => `\`${p}\``)
				.join(", ");

			const embed = Embed({
				title: command.triggers[0],
				description: `\`${command.description}\``,
				user: message.author,
				fields: [
					{
						name: "Aliasy",
						value: `\`${command.triggers.join(", ")}\``,
					},
					{
						name: "Poziom dostępu",
						value: `${permissions ? permissions : "`BRAK`"}${
							permissions && command.role
								? ` bądź <@&${command.role}>`
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
	},
};

module.exports = command;
