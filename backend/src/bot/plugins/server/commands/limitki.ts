import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";
import { getUserHex } from "./hex";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { selectUserHex } from "./shared";
import { Roles } from "../../../constants";

const path = join(
	// __dirname,
	// "vehicles.json"
	"/home/rdm/server/data/resources/[4rdm]/4rdm/data/auta/vehicles.json"
);

export default async function ({ client, interaction }: CommandArgs) {
	if (!existsSync(path))
		return interaction.Reply({ embeds: [ErrorEmbedInteraction(interaction, "Funkcja niedostępna na tym komputerze!")] });

	if (!interaction.isChatInputCommand()) return;

	const subcommand = interaction.options.getSubcommand();
	const userJson = (await import(path)).default;
	const mention = interaction.options.getUser("mention", true);
	const hexOverride = interaction.options.getString("hex", false);

	if (subcommand === "dodaj") {
		const spawnName = interaction.options.getString("spawn-name", true);
		const displayName = interaction.options.getString("display-name", true);
		const userHexes = await getUserHex(client, mention.id);
		const currentHex = hexOverride || await selectUserHex(userHexes, interaction);

		if (!currentHex) return;

		if (!userJson[currentHex]) userJson[currentHex] = [];
		userJson[currentHex].push([spawnName, displayName]);

		writeFileSync(path, JSON.stringify(userJson), { encoding: "utf-8" });

		const embed = Embed({
			title: ":white_check_mark: | Dodano limitkę!",
			color: "#1F8B4C",
			author: {
				name: mention.tag,
				iconURL: mention.displayAvatarURL(),
			},
			description: `**Hex**: \`${currentHex}\`\n**Spawn name**: \`${spawnName}\`\n**Display name**: \`${displayName}\``,
			user: interaction.user,
		});

		interaction.Reply({ embeds: [embed] });
	} else if (subcommand === "usun") {
		const spawnName = interaction.options.getString("spawn-name", true);
		const userHexes = await getUserHex(client, mention.id);
		const currentHex = hexOverride || await selectUserHex(userHexes, interaction);

		if (!currentHex) return;

		const index = userJson[currentHex].findIndex((x: string[]) => x[0] == spawnName);
		if (index == -1) {
			const embed = ErrorEmbedInteraction(interaction, `Nie znaleziono limitki o nazwie \`${spawnName}\`!`);

			return interaction.Reply({ embeds: [embed] });
		}

		userJson[currentHex].splice(index, 1);

		writeFileSync(path, JSON.stringify(userJson), { encoding: "utf-8" });

		const embed = Embed({
			title: ":x: | Usunięto limitkę!",
			color: "#f54242",
			author: {
				name: mention.tag,
				iconURL: mention.displayAvatarURL(),
			},
			description: `**Hex**: \`${currentHex}\`\n**Spawn name**: \`${spawnName}\``,
			user: interaction.user,
		});
		
		interaction.Reply({ embeds: [embed] });
	} else if (subcommand === "lista") {
		const userHexes = await getUserHex(client, mention.id);

		if (!userHexes)
			return interaction.Reply({
				embeds: [ErrorEmbedInteraction(interaction, "Wystąpił błąd bazy danych")],
			});

		if (!userHexes[0])
			return interaction.Reply({
				embeds: [ErrorEmbedInteraction(interaction, "Nie znaleziono gracza!")],
			});

		const limitki: { [key: string]: string[][] } = {};
		const description: string[] = [];

		userHexes.forEach((x) => {
			limitki[x?.identifier || ""] = userJson[x?.identifier || ""];
		});

		Array.from(Object.keys(limitki)).forEach((hex) => {
			if (limitki[hex]) {
				description.push(`**${hex}**:`);
				limitki[hex].forEach((limitka: string[]) => {
					description.push(`\`${limitka[0]}\`: \`${limitka[1]}\``);
				});
			}
		});

		const embed = Embed({
			author: {
				name: mention.username,
				iconURL: mention.displayAvatarURL(),
			},
			user: interaction.user,
			title: "Limitki użytkownika",
			description: description.join("\n"),
		});

		interaction.Reply({ embeds: [embed] });
	}
}

export const info: CommandInfo = {
	triggers: ["limitki"],
	description: "Zarządzanie limitkami graczy",
	permissions: PermissionFlagsBits.Administrator,
	role: [Roles.Zarzad, Roles.HeadAdmin, Roles.Developer], // ZARZĄD
	builder: new SlashCommandBuilder()
		.addSubcommand(subcommand =>
			subcommand
				.setName("dodaj")
				.setDescription("Dodaje limitkę")
				.addUserOption(option => option.setName("mention").setDescription("Użytkownik").setRequired(true))
				.addStringOption(option => option.setName("spawn-name").setDescription("Spawn name").setRequired(true))
				.addStringOption(option => option.setName("display-name").setDescription("Nazwa wyświetlana limitki").setRequired(true))
				.addStringOption(option => option.setName("hex").setDescription("Hex użytkownika").setRequired(false))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("usun")
				.setDescription("Usuwa limitkę")
				.addUserOption(option => option.setName("mention").setDescription("Użytkownik").setRequired(true))
				.addStringOption(option => option.setName("spawn-name").setDescription("Spawn name").setRequired(true))
				.addStringOption(option => option.setName("hex").setDescription("Hex użytkownika").setRequired(false))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("lista")
				.setDescription("Lista limitek gracza")
				.addUserOption(option => option.setName("mention").setDescription("Użytkownik").setRequired(true))
		)
		.setName("limitki"),
};
