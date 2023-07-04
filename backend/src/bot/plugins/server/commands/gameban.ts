import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";

export default async function ({ client, interaction }: CommandArgs) {
	if (!interaction.isChatInputCommand()) return;

	const id = interaction.options.getInteger("id", true);

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
		.rcon(`ban ${id}`)
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

export const info: CommandInfo = {
	triggers: ["gameban"],
	description: "Zbanuj osobę na serwerze",
	permissions: PermissionFlagsBits.Administrator,
	role: "843444642539110400", // TEAM 4RDM
	builder: new SlashCommandBuilder()
		.addIntegerOption(option =>
			option
				.setName("id")
				.setDescription("ID osoby do zbanowania")
				.setRequired(true)
		)
		.setName("gameban"),
};
