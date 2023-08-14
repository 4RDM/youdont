import {
	AutocompleteInteraction,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "discord.js";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";
import { Roles } from "../../../constants";

export default async function ({ client, interaction }: CommandArgs) {
	if (!interaction.isChatInputCommand()) return;

	const id = interaction.options.getInteger("id", true);
	const czas = interaction.options.getInteger("czas", true);
	const powod = interaction.options.getString("powod", true);

	if (isNaN(parseInt(<never>czas)))
		return interaction.Reply({
			embeds: [
				ErrorEmbedInteraction(interaction, "Czas jest nieprawidłowy"),
			],
		});

	const interactionReply = await interaction.Reply({
		embeds: [
			Embed({
				description: "**Wysyłanie**",
				user: interaction.user,
			}),
		],
	});

	if (!interactionReply) return;

	client.core
		.rcon(`ban ${id} ${czas} ${powod.replace(/[`;]/gm, "")}`)
		.then(() => {
			interactionReply.edit({
				embeds: [
					Embed({
						color: "#1F8B4C",
						description: "**Wysłano!**",
						user: interaction.user,
					}),
				],
			});
		})
		.catch(() => {
			interactionReply.edit({
				embeds: [
					ErrorEmbedInteraction(
						interaction,
						"Nie udało się wysłać polecenia"
					),
				],
			});
		});
}

// prettier-ignore
export async function autocomplete(client: CommandArgs["client"], interaction: AutocompleteInteraction) {
	interaction.respond([
		{ name: "6 godzin", value: 21600 },
		{ name: "12 godzin", value: 43200 },
		{ name: "1 dzień", value: 86400 },
		{ name: "3 dni", value: 259200 },
		{ name: "1 tydzień", value: 518400 },
		{ name: "2 tydzień", value: 1123200 },
		{ name: "1 miesiąc", value: 2678400 },
		{ name: "1 rok", value: 31536000 },
		{ name: "Permamenty", value: 10444633200 },
	]);
}

export const info: CommandInfo = {
	triggers: ["gameban"],
	description: "Zbanuj osobę na serwerze",
	permissions: PermissionFlagsBits.Administrator,
	role: Roles.Team, // TEAM 4RDM
	builder: new SlashCommandBuilder()
		.addIntegerOption(option =>
			option
				.setName("id")
				.setDescription("ID osoby do zbanowania")
				.setRequired(true)
		)
		.addIntegerOption(option =>
			option
				.setName("czas")
				.setDescription("Czas bana w sekundach")
				.setRequired(true)
				.setAutocomplete(true)
		)
		.addStringOption(option =>
			option
				.setName("powod")
				.setMaxLength(100)
				.setDescription("Powód bana")
				.setRequired(true)
		)
		.setName("gameban"),
};
