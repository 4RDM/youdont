import {
	HexColorString,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "discord.js";
import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";
import hexToRGB from "../../../../utils/hexToRGB";
import { getUserHex } from "./hex";
import { awaitMessage } from "./shared";
import { Roles } from "../../../constants";

export interface Role {
	tag: string;
	r: number;
	g: number;
	b: number;
	comment: string;
}

export interface Roles extends Array<{ [k: `steam:${string}`]: Role }> {
	[k: `steam:${string}`]: Role;
}

// prettier-ignore
const path = join("/home/rdm/server/data/resources/[4rdm]/4rdm/data/roles.json");

// prettier-ignore
export default async function ({ client, interaction }: CommandArgs) {
	if (!existsSync(path))
		return interaction.Reply({ embeds: [ErrorEmbedInteraction(interaction, "Funkcja niedostępna na tym komputerze!")] });

	if (!interaction.isChatInputCommand()) return;

	const mention = interaction.options.getUser("mention", true);
	const kolor = interaction.options.getString("kolor", true);
	const prefix = interaction.options.getString("prefix", true);

	if (!kolor.startsWith("#") || kolor.length !== 7 || !kolor.match(/^#[0-9a-fA-F]+$/))
		return interaction.Reply({
			embeds: [ErrorEmbedInteraction(interaction, "Niepoprawny format koloru")],
		});

	const rolesJson: Roles | null = (await import(path)).default;

	if (!rolesJson)
		return interaction.Reply({
			embeds: [ErrorEmbedInteraction(interaction, "Wystąpił błąd bazy danych")],
		});

	const userHexes = await getUserHex(client, mention.id);
	let currentHex = "";

	if (!userHexes || !userHexes[0])
		return interaction.Reply({
			embeds: [ErrorEmbedInteraction(interaction, "Nie znaleziono użytkownika")],
		});
		
	if (userHexes.length > 1) {
		const hexes = userHexes.map((hex, i) => `${i + 1}. ${hex?.identifier}`).join("\n");
		let awaitedMessage;

		interaction.Reply(`\`\`\`Znalezione identyfikatory:\n${hexes}\`\`\`\nKtóry z nich użyć?`);

		try {
			awaitedMessage = await awaitMessage(interaction);
		} catch (e) {
			return interaction.Reply({
				embeds: [ErrorEmbedInteraction(interaction, "Nie wprowadzono odpowiedzi")],
			});
		}

		const index = parseInt(awaitedMessage);

		if (isNaN(index))
			return interaction.Reply({
				embeds: [ErrorEmbedInteraction(interaction, "Wprowadzono błędny index, nie jest cyfrą!")]
			});

		const temp = userHexes[index - 1];

		if (!temp)
			return interaction.Reply({
				embeds: [ErrorEmbedInteraction(interaction, "Wybrano błędny hex!")]
			});
		
		currentHex = temp.identifier;
	} else {
		currentHex = userHexes[0].identifier;
	}

	const { r, g, b } = hexToRGB(kolor as HexColorString);
	rolesJson[`${currentHex as `steam:${string}`}`] = { tag: prefix, r, g, b, comment: `${mention.tag} (${mention.id})` };

	writeFileSync(path, JSON.stringify(rolesJson, null, "\t"), { encoding: "utf-8" });

	const embed = Embed({
		title: ":white_check_mark: | Zmieniono przedrostek",
		color: "#1F8B4C",
		description: `Zmieniono przedrostek gracza ${mention.tag} (${mention.id}) na ${prefix}`
	});

	interaction.Reply({ embeds: [embed] });

	client.core.rcon("reloadchat");
}

export const info: CommandInfo = {
	triggers: ["nick"],
	description: "Zmień przedrostek gracza",
	permissions: PermissionFlagsBits.Administrator,
	role: [Roles.Nick], // !nick
	builder: new SlashCommandBuilder()
		.addUserOption(option =>
			option
				.setName("mention")
				.setDescription("Użytkownik")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("kolor")
				.setDescription("Kolor nicku (hex)")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("prefix")
				.setDescription("Nowy przedrostek")
				.setRequired(true)
		)
		.setName("nick"),
};
