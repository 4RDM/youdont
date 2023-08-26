import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";
import {
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "discord.js";
import { Roles } from "../../../constants";

const path = join("/home/rdm/server/data/resources/[4rdm]/4rdm/data/auta/antilag.json");

export default async function ({ client, interaction }: CommandArgs) {
	if (!existsSync(path))
		return interaction.Reply({ embeds: [ErrorEmbedInteraction(interaction, "Funkcja niedostępna na tym komputerze!")] });

	if (!interaction.isChatInputCommand()) return;

	let antilagJson = (await import(path)).default as string[];
	const subcommand = interaction.options.getSubcommand();
	const spawnName = interaction.options.getString("spawn-name", true);

	if (subcommand == "dodaj") {
		if (antilagJson.find(x => x == spawnName))
			return interaction.Reply({ embeds: [ErrorEmbedInteraction(interaction, "Samochód jest już dodany!")] });

		antilagJson.push(spawnName);

		writeFileSync(path, JSON.stringify(antilagJson), { encoding: "utf-8" });

		const embed = Embed({
			title: ":x: | Usunięto auto współdzielone!",
			color: "#f54242",
			user: interaction.user,
		});

		interaction.Reply({ embeds: [embed] });
	} else if (subcommand == "usun") {
		if (!antilagJson.find(x => x == spawnName))
			return interaction.Reply({ embeds: [ErrorEmbedInteraction(interaction, "Samochód nie znajduje się na liście!")] });
		
		antilagJson = antilagJson.filter(x => x != spawnName);

		writeFileSync(path, JSON.stringify(antilagJson), { encoding: "utf-8" });

		const embed = Embed({
			title: ":white_check_mark: | Dodano antilaga!",
			color: "#1F8B4C",
			user: interaction.user,
		});

		interaction.Reply({ embeds: [embed] });
	}
}

export const info: CommandInfo = {
	triggers: ["antilag"],
	description: "Antilag do samochodu",
	permissions: PermissionFlagsBits.Administrator,
	role: [Roles.Zarzad, Roles.HeadAdmin, Roles.Developer],
	builder: new SlashCommandBuilder()
		.addSubcommand(subcommand =>
			subcommand
				.setName("dodaj")
				.setDescription("Dodaj antilaga")
				.addStringOption(option => option.setName("spawn-name").setDescription("Spawn name").setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("usun")
				.setDescription("Usuń antilaga")
				.addStringOption(option => option.setName("spawn-name").setDescription("Spawn name").setRequired(true))
		)
		.setName("antilag"),
};
