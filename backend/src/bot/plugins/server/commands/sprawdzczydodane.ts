import { join } from "path";
import { existsSync } from "fs";
import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";

const path = join(
	"/home/rdm/server/data/resources/[optymalizacja kurwa]/auta/stream"
);

export const execute = async function ({ message, args }: CommandArgs) {
	// prettier-ignore
	if (!existsSync(path))
		return message.channel.send({ embeds: [ ErrorEmbed(message, "Funkcja niedostępna na tym komputerze!") ] });

	// prettier-ignore
	if (!args[0])
		return message.channel.send({ embeds: [ ErrorEmbed(message, "Nie wprowadzono resp-name pojazdu") ] });

	// prettier-ignore
	if (!existsSync(join(path, args[0])))
		return message.channel.send({
			embeds: [
				Embed({
					title: ":x: | Nie znaleziono pojazdu!",
					color: "#f54242",
					user: message.author,
				}),
			],
		});
	else
		return message.channel.send({
			embeds: [
				Embed({
					title: ":white_check_mark: | Pojazd jest już na serwerze",
					color: "#1F8B4C",
					user: message.author,
				}),
			],
		});
};

export const info: CommandInfo = {
	triggers: ["sprawdz", "sprawdź"],
	description: "Sprawdź czy auto jest dodane na serwer",
	permissions: ["KickMembers"],
	role: "843444626726584370", // ZARZĄD
};
