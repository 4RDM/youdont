import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";
import { Command } from "../../../../types";

const command: Command = {
	triggers: ["unban"],
	description: "Odbanuj osobę na serwerze",
	permissions: ["ADMINISTRATOR"],
	role: "843444642539110400", // TEAM 4RDM
	async exec(client, message, args) {
		if (!args[0])
			return message.channel.send({
				embeds: [ErrorEmbed(message, "Prawidłowe użycie: `.unban <id-bana>`")],
			});

		const msg = await message.channel.send({
			embeds: [
				Embed({
					description: "**Wysyłanie**",
					user: message.author,
				}),
			],
		});

		client.Core.rcon.send(args.join(`unban ${parseInt(args[0])}`),
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
				msg.edit({
					embeds: [ErrorEmbed(message, "Nie udało się wysłać polecenia")],
				});
			}
		);
	},
};

module.exports = command;
