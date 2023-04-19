import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";
import { CommandArgs } from "../../../../types";

import rcon from "ts-rcon";
import config from "../../../../config";

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

	const rconClient = new rcon(
		config.rcon.host,
		config.rcon.port,
		config.rcon.pass,
		{
			tcp: false,
			challenge: false,
		}
	);

	rconClient.send("exec permisje.cfg");

	// Listen to the response event
	rconClient.on("response", str => {
		msg.edit({
			embeds: [
				Embed({
					color: "#1F8B4C",
					description: "**Wysłano!**",
					user: message.author,
				}),
			],
		});
	});

	// Listen to the error event
	rconClient.on("error", err => {
		msg.edit({
			embeds: [ErrorEmbed(message, "Nie udało się wysłać polecenia")],
		});
	});
};

export const info = {
	triggers: ["cmd", "command"],
	description: "Wyślij polecenie do konsoli",
	permissions: ["ADMINISTRATOR"],
	role: "843444626726584370", // ZARZĄD
};
