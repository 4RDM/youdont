import { join } from "path";
import { existsSync } from "fs";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const path = join(
	"/home/rdm/server/data/resources/[optymalizacja kurwa]/auta/stream"
);

// prettier-ignore
export default async function ({ interaction }: CommandArgs) {
	if (!interaction.isChatInputCommand()) return;
	
	if (!existsSync(path))
		return interaction.Reply({ embeds: [ErrorEmbedInteraction(interaction, "Funkcja niedostępna na tym komputerze!")] });

	const respName = interaction.options.getString("resp-name", true);

	if (!existsSync(join(path, respName)))
		return interaction.Reply({
			embeds: [
				Embed({
					title: ":x: | Nie znaleziono pojazdu!",
					color: "#f54242",
					user: interaction.user,
				}),
			],
		});
	else
		return interaction.Reply({
			embeds: [
				Embed({
					title: ":white_check_mark: | Pojazd jest już na serwerze",
					color: "#1F8B4C",
					user: interaction.user,
				}),
			],
		});
}

export const info: CommandInfo = {
	triggers: ["sprawdz", "sprawdź"],
	description: "Sprawdź czy auto jest dodane na serwer",
	permissions: PermissionFlagsBits.KickMembers,
	role: "843444626726584370", // ZARZĄD
	builder: new SlashCommandBuilder()
		.addStringOption(option =>
			option
				.setName("resp-name")
				.setDescription("Nazwa pojazdu")
				.setRequired(true)
		)
		.setName("sprawdz"),
};
