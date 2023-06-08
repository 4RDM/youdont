import { HexColorString, SlashCommandBuilder } from "discord.js";
import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";
import hexToRGB from "../../../../utils/hexToRGB";
import { getUserHex } from "./hex";
import { awaitMessage } from "./shared";

export interface Role {
	tag: string;
	r: number;
	g: number;
	b: number;
	comment: string;
}

export interface Roles extends Array<Role> {
	[k: `steam:${string}`]: Role;
}

// prettier-ignore
const path = join("/home/rdm/server/data/resources/[Nimplex]/4rdm/data/roles.json");

// prettier-ignore
export default async function ({ client, interaction }: CommandArgs) {
	if (!existsSync(path))
		return interaction.reply({ embeds: [ErrorEmbedInteraction(interaction, "Funkcja niedostępna na tym komputerze!")] });

	if (!interaction.isChatInputCommand()) return;

	let reply;
	const mention = interaction.options.getUser("mention", true);
	const kolor = interaction.options.getString("kolor", true);
	const prefix = interaction.options.getString("prefix", true);

	if (!kolor.startsWith("#") || kolor.length !== 7 || !kolor.match(/^[0-9a-fA-F]+$/))
		return reply = interaction.reply({
			embeds: [ErrorEmbedInteraction(interaction, "Niepoprawny format koloru")],
		});

	const rolesJson: Roles | null = (await import(path)).default;

	if (!rolesJson)
		return reply = interaction.reply({
			embeds: [ErrorEmbedInteraction(interaction, "Wystąpił błąd bazy danych")],
		});

	const userHexes = await getUserHex(client, mention.id);
	let currentHex = "";

	if (!userHexes)
		return reply = interaction.reply({
			embeds: [ErrorEmbedInteraction(interaction, "Wystąpił błąd bazy danych")],
		});

	if (!userHexes[0])
		return reply = interaction.reply({
			embeds: [ErrorEmbedInteraction(interaction, "Nie znaleziono gracza")],
		});
	
	if (userHexes.length > 1) {
		const hexes = userHexes.map((hex, i) => `${i + 1}. ${hex}`).join("\n");
		let awaitedMessage;

		reply = interaction.reply(`\`\`\`Znalezione identyfikatory:\n${hexes}\`\`\`\nKtóry z nich użyć?`);

		try {
			awaitedMessage = await awaitMessage(interaction);
		} catch (e) {
			return interaction.reply({
				embeds: [ErrorEmbedInteraction(interaction, "Nie wprowadzono odpowiedzi")],
			});
		}

		const index = parseInt(awaitedMessage);

		if (isNaN(index))
			return interaction.reply({
				embeds: [ErrorEmbedInteraction(interaction, "Wprowadzono błędny index, nie jest cyfrą!")]
			});

		const temp = userHexes[index - 1];

		if (!temp)
			return interaction.reply({
				embeds: [ErrorEmbedInteraction(interaction, "Wybrano błędny hex!")]
			});
		
		currentHex = temp.identifier;
	} else {
		currentHex = userHexes[0].identifier;
	}

	const { r, g, b } = hexToRGB(kolor as HexColorString);
	rolesJson[`steam:${currentHex}`] = { tag: prefix, r, g, b, comment: `${mention.tag} (${mention.id})` };

	writeFileSync(path, JSON.stringify(rolesJson, null, "\t"), { encoding: "utf-8" });

	const embed = Embed({
		title: ":white_check_mark: | Zmieniono przedrostek",
		color: "#1F8B4C",
		description: `Zmieniono przedrostek gracza ${mention.tag} (${mention.id}) na ${prefix}`
	});

	if (reply) interaction.followUp({ embeds: [embed] });
	else interaction.reply({ embeds: [embed] });

	client.Core.rcon("reloadchat");
}

export const info: CommandInfo = {
	triggers: ["nick"],
	description: "Zmień przedrostek gracza",
	role: "981302459043577907", // !nick
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
