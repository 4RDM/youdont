import { Embed } from "../../../../utils/discordEmbed";
import { Command } from "../../../../types";

const command: Command = {
	triggers: ["cmd", "command"],
	description: "Wyślij polecenie do konsoli",
	permissions: ["ADMINISTRATOR"],
	role: "843444626726584370", // ZARZĄD
	async exec(client, message, args) {
		if (!args[0])
			return message.channel.send({
				embeds: [
					Embed({
						color: "#E74C3C",
						title: "Błąd składni polecenia",
						description:
							"```Brakuje parametru 'cmd',\nPrawidłowe użycie: .cmd polecenie```",
						user: message.author,
					}),
				],
			});

		const msg = await message.channel.send({
			embeds: [
				Embed({
					description: "**Wysyłanie**",
					user: message.author,
				}),
			],
		});

		client.Core.rcon.send(
			args.join(" "),
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
			},
			() => {
				msg.edit({
					embeds: [
						Embed({
							color: "#E74C3C",
							description: "**Wystąpił błąd!**",
							user: message.author,
						}),
					],
				});
			}
		);
	},
};

module.exports = command;
