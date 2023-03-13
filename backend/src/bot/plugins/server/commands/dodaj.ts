import { ErrorEmbed } from "../../../../utils/discordEmbed";
import { addFile } from "../../../../utils/filesystem";
import { hexToDec } from "../../../../utils/strings";
import { CommandArgs } from "../../../../types";

export const execute = async function ({ message, args, client }: CommandArgs) {
	const mention = message.mentions.users?.first();
	if (args.length < 3 || !mention)
		return message.channel.send({
			embeds: [
				ErrorEmbed(
					message,
					"Prawidłowe użycie: `.dodaj <hex> <ranga> <@ping>`"
				),
			],
		});
	const msg = await message.channel.send("Wysyłanie polecenia do konsoli");
	addFile(
		`add_principal identifier.steam:${args[0]} group.${args[1]} # ${
			mention.tag
		} (${mention.id}) https://steamcommunity.com/profiles/${hexToDec(
			args[0]
		)} ${new Date().toLocaleDateString()}`,
		"F:\\fivem-server\\base\\permisje.cfg"
	)
		.then(() => {
			msg.edit("Pomyślnie wysłano");
			client.Core.rcon.send("reload");
		})
		.catch(() => {
			msg.edit("Wystąpił błąd");
		});
};

export const info = {
	triggers: ["dodaj"],
	description: "Dodaj użytkownika do konfiguracji",
	permissions: ["ADMINISTRATOR"],
	role: "843444626726584370", // ZARZĄD
};
