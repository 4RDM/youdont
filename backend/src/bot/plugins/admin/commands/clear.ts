import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";

// prettier-ignore
export default async function ({ interaction }: CommandArgs) {
	if (!interaction.isChatInputCommand() || !interaction.channel || !interaction.channel.isTextBased() || !interaction.inGuild()) return;

	const amount = interaction.options.getInteger("amount", true);

	const messages = await interaction.channel.messages.fetch({
		limit: amount,
	});

	try {
		await interaction.channel.bulkDelete(messages);
		interaction.Reply({
			embeds: [
				Embed({
					color: "#1F8B4C",
					title: ":broom: Brooooom",
					description: `Usunięto **${amount}** wiadomości!`,
					user: interaction.user,
				}),
			],
		});
	} catch (err) {
		interaction.Reply({
			embeds: [
				ErrorEmbedInteraction(
					interaction,
					"**Wystąpił błąd podczas usuwania wiadomości**"
				),
			],
		});
	}
}

export const info: CommandInfo = {
	triggers: ["clear", "purge", "wyczysc"],
	description: "Usuwa określoną ilość wiadomości",
	permissions: PermissionFlagsBits.ManageMessages,
	builder: new SlashCommandBuilder()
		.addIntegerOption(option =>
			option
				.setName("amount")
				.setDescription("Ilość wiadomości do usunięcia")
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(100)
		)
		.setName("clear"),
};
