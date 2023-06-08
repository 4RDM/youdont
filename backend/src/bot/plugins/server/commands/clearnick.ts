import { SlashCommandBuilder } from "discord.js";
import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";
import { getUserHex } from "./hex";
import { awaitMessage } from "./shared";
import { Roles } from "./nick";

// prettier-ignore
const path = join("/home/rdm/server/data/resources/[Nimplex]/4rdm/data/roles.json");

// prettier-ignore
export default async function ({ client, interaction }: CommandArgs) {
	if (!existsSync(path))
		return interaction.reply({ embeds: [ErrorEmbedInteraction(interaction, "Funkcja niedostępna na tym komputerze!")] });

	if (!interaction.isChatInputCommand()) return;

	let reply;
	const mention = interaction.options.getUser("mention", true);

	let rolesJson: Roles | null = (await import(path)).default;

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

	const keys = Object.keys(rolesJson);
	rolesJson = Array.from(rolesJson).filter((_, key) => keys[key] !== currentHex);

	writeFileSync(path, JSON.stringify(rolesJson, null, "\t"), { encoding: "utf-8" });

	const embed = Embed({
		title: ":x: | Wyczyszczono przedrostek",
		color: "#f54242",
	});

	if (reply) interaction.followUp({ embeds: [embed] });
	else interaction.reply({ embeds: [embed] });

	client.Core.rcon("reloadchat");
}

export const info: CommandInfo = {
	triggers: ["clearnick"],
	description: "Usun przedrostek gracza",
	role: "981302459043577907", // !nick
	builder: new SlashCommandBuilder()
		.addUserOption(option =>
			option
				.setName("mention")
				.setDescription("Użytkownik")
				.setRequired(true)
		)
		.setName("clearnick"),
};
