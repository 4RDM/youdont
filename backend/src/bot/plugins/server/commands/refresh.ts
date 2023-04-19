import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";
import { CommandArgs } from "../../../../types";
import logger from "../../../../utils/logger";

import rcon from "ts-rcon";
import config from "../../../../config";

export const execute = async function ({ client, message }: CommandArgs) {
	const msg = await message.channel.send({
		embeds: [
			Embed({
				description: "**Wysyłanie**",
				user: message.author,
			}),
		],
	});

	// console.log(rcon);

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

	// rcon.on("", () => {
	// 	msg.edit({
	// 		embeds: [
	// 			Embed({
	// 				color: "#1F8B4C",
	// 				description: "**Wysłano!**",
	// 				user: message.author,
	// 			}),
	// 		],
	// 	});
	// });
};

export const info = {
	triggers: ["refresh"],
	description: "Przeładuj uprawnienia na serwerze",
	permissions: ["ADMINISTRATOR"],
	role: "843444626726584370", // ZARZĄD
};
