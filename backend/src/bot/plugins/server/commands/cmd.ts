import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";
import { Command } from "../../../../types";

const command: Command = {
	triggers: ["cmd", "command"],
	description: "Wyślij polecenie do konsoli",
	permissions: ["ADMINISTRATOR"],
	role: "843444626726584370", // ZARZĄD
	async exec(client, message, args) {
		if (!args[0])
			return message.channel.send({
				embeds: [ErrorEmbed(message, "Prawidłowe użycie: `.cmd <polecenie>`")],
			});

		const msg = await message.channel.send({
			embeds: [
				Embed({
					description: "**Wysyłanie**",
					user: message.author,
				}),
			],
		});

		client.Core.rcon.send(args.join(" "),
			() => {
				msg.edit({
					embeds: [
						Embed({
							color: "#1F8B4C",
							description: "**Wysłano!**",
							user: message.author,
						}),
					],
				});
			}, () => {
				msg.edit({ embeds: [ErrorEmbed(message, "Nie udało się wysłać polecenia")] });
			}
		);
	},
};


module.exports = command;
