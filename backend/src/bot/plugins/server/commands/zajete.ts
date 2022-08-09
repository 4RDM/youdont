import { Embed } from "../../../../utils/discordEmbed";
import { CommandArgs } from "../../../../types";

export const execute = async function({ message }: CommandArgs) {
	message.channel.send({ embeds: [
		Embed({
			description: "Pojazd, który wybrałeś jest już zajęty przez innego gracza 4RDM jako auto prywatne lub zostało dodane do menu partnera. **Wybierz inny pojazd!**",
			color: "#f54242",
			user: message.author
		})
	] })
};

export const info = {
	triggers: ["zajete"],
	description: "Wyślij wiadomość informującą o duplikacie pojazdu na serwerze",
	role: "883475949964906516" // developer
};