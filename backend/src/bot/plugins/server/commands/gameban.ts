import { Embed } from "../../../../utils/discordEmbed";
import { Command } from "../../../../types";

const command: Command = {
	triggers: ["gameban"],
	description: "Zbanuj osobę na serwerze",
	permissions: ["ADMINISTRATOR"],
	role: "843444642539110400", // TEAM 4RDM
	async exec(client, message, args) {
		if (!args[0])
			return message.channel.send({
				embeds: [
					Embed({
						color: "#E74C3C",
						title: "Błąd składni polecenia",
						description:
							"```Brakuje parametru 'ID',\nPrawidłowe użycie: .gameban id```",
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
			args.join(`ban ${args[0]}`),
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
