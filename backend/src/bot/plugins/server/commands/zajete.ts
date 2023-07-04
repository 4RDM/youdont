import { SlashCommandBuilder } from "discord.js";
import { Embed } from "../../../../utils/discordEmbed";
import { Roles } from "../../../constants";

export default async function ({ interaction }: CommandArgs) {
	interaction.Reply({
		embeds: [
			Embed({
				description:
					"Pojazd, który wybrałeś jest już zajęty przez innego gracza 4RDM jako auto prywatne lub zostało dodane do menu partnera. **Wybierz inny pojazd!**",
				color: "#f54242",
				user: interaction.user,
			}),
		],
	});
}

export const info: CommandInfo = {
	triggers: ["zajete"],
	description:
		"Wyślij wiadomość informującą o duplikacie pojazdu na serwerze",
	role: Roles.Developer, // developer
	builder: new SlashCommandBuilder().setName("zajete"),
};
