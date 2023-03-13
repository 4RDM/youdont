import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";
import { CommandArgs } from "../../../../types";

export const execute = async function ({ client, message }: CommandArgs) {
	const msg = await message.channel.send({
		embeds: [
			Embed({
				description: "**Wysyłanie**",
				user: message.author,
			}),
		],
	});
	client.Core.rcon.send(
		"exec permisje.cfg",
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
				embeds: [ErrorEmbed(message, "Nie udało się wysłać polecenia")],
			});
		}
	);
};

export const info = {
	triggers: ["refresh"],
	description: "Przeładuj uprawnienia na serwerze",
	permissions: ["ADMINISTRATOR"],
	role: "843444626726584370", // ZARZĄD
};
