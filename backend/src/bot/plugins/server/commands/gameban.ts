import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";
import { CommandArgs } from "../../../../types";

export const execute = async function ({ client, message, args }: CommandArgs) {
	if (!args[0])
		return message.channel.send({
			embeds: [ErrorEmbed(message, "Prawidłowe użycie: `.gameban <id>`")],
		});

	const msg = await message.channel.send({
		embeds: [
			Embed({
				description: "**Wysyłanie**",
				user: message.author,
			}),
		],
	});

	client.Core.rcon(args.join(`ban ${args[0]}`))
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
		.catch(() => {
			msg.edit({
				embeds: [ErrorEmbed(message, "Nie udało się wysłać polecenia")],
			});
		});
};

export const info = {
	triggers: ["gameban"],
	description: "Zbanuj osobę na serwerze",
	permissions: ["ADMINISTRATOR"],
	role: "843444642539110400", // TEAM 4RDM
};
