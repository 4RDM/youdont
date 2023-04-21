import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";
import { Command, CommandArgs } from "../../../../types";

export const execute = async function ({ client, message, args }: CommandArgs) {
	if (!args[0])
		return message.channel.send({
			embeds: [
				ErrorEmbed(message, "Prawidłowe użycie: `.cmd <polecenie>`"),
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

	client.Core.rcon("exec permisje.cfg")
		.then(() => {
			msg.edit({
				embeds: [
					Embed({
						color: "#1F8B4C",
						description: "**Wysłano!**",
						user: message.author,
					}),
				],
			});
		})
		.catch(err => {
			msg.edit({
				embeds: [ErrorEmbed(message, "Nie udało się wysłać polecenia")],
			});
		});
};

export const info: Command["info"] = {
	triggers: ["cmd", "command"],
	description: "Wyślij polecenie do konsoli",
	permissions: ["Administrator"],
	role: "843444626726584370", // ZARZĄD
};
