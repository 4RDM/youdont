import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";
import { CommandArgs } from "../../../../types";

export const execute = async function({ client, message, args }: CommandArgs) {
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

	client.Core.rcon.send(args.join(" "), () =>
	{
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
	});
};

export const info = {
	triggers: ["cmd", "command"],
	description: "Wyślij polecenie do konsoli",
	permissions: ["ADMINISTRATOR"],
	role: "843444626726584370", // ZARZĄD
};
