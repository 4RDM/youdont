import {
	Interaction,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "discord.js";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";

export async function odrzuc(
	client: CommandArgs["client"],
	interaction: Interaction,
	id: number
) {
	if (!interaction.isButton() && !interaction.isCommand()) return;

	const donate = await client.core.database.donates.get(id);

	if (!donate)
		return interaction.Reply({
			embeds: [
				ErrorEmbedInteraction(
					interaction,
					"Nie znaleziono zarejestrowanej wpłaty o takim ID"
				),
			],
		});

	if (donate.approved)
		return interaction.Reply({
			embeds: [
				ErrorEmbedInteraction(
					interaction,
					"Wpłata została wcześniej zaakceptowana"
				),
			],
		});

	(await client.users.createDM(donate.discordID)).send({
		embeds: [
			Embed({
				title: ":x: | Wpłata na serwer",
				description:
					"Twoja wpłata została odrzucona przez administratora",
				fields: [
					{
						name: "Administrator",
						value: `\`${interaction.user.tag} (${interaction.user.id})\``,
						inline: false,
					},
					{
						name: "ID wpłaty",
						value: `\`${donate.id}\``,
						inline: false,
					},
				],
				color: "#f54242",
				footer: "",
				user: interaction.user,
			}),
		],
	});

	interaction.Reply({
		embeds: [
			Embed({
				title: ":x: | Odrzucono wpłatę",
				color: "#f54242",
				description: `Odrzucono wpłatę o ID \`${donate.id}\``,
				user: interaction.user,
			}),
		],
	});
}

export default async function ({ client, interaction }: CommandArgs) {
	if (!interaction.isChatInputCommand()) return;

	const id = interaction.options.getInteger("id", true);

	odrzuc(client, interaction, id);
}

export const info: CommandInfo = {
	triggers: ["odrzuc", "odrzuć"],
	description: "Odrzuć donate o danym ID",
	permissions: PermissionFlagsBits.Administrator,
	builder: new SlashCommandBuilder()
		.addIntegerOption(option =>
			option.setName("id").setDescription("ID wpłaty").setRequired(true)
		)
		.setName("odrzuc"),
};
