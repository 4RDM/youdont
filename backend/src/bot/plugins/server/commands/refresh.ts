import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";

export default async function ({ client, message }: CommandArgs) {
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
		.catch(() => {
			msg.edit({
				embeds: [ErrorEmbed(message, "Nie udało się wysłać polecenia")],
			});
		});
}

export const info: CommandInfo = {
	triggers: ["refresh"],
	description: "Przeładuj uprawnienia na serwerze",
	permissions: ["Administrator"],
	role: "843444626726584370", // ZARZĄD
};
