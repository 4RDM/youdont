import {
	GuildMember,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "discord.js";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";

// prettier-ignore
export default async function ({ interaction }: CommandArgs) {
	if (!interaction.isChatInputCommand() || !interaction.guild) return;

	const mention = interaction.options.getMember("mention") as GuildMember;
	const reason = interaction.options.getString("reason", false);

	if (!mention.kickable)
		return interaction.Reply({ embeds: [ErrorEmbedInteraction(interaction, "Nie udało się wyrzucić tego użytkownika!")] });

	const member = await interaction.guild.members.fetch(interaction.user.id);
		
	if (
		interaction.user.id !== "594526434526101527" &&
		interaction.user.id !== "364056796932997121" &&
		mention.roles.highest.position > member.roles.highest.position
	)
		return interaction.Reply({ embeds: [ErrorEmbedInteraction(interaction, "Użytkownik jest wyżej niż ty!")] });	
		
	if (
		(mention.id == "594526434526101527" && interaction.user.id !== "364056796932997121") ||
		(mention.id == "364056796932997121" && interaction.user.id !== "594526434526101527")
	) return interaction.Reply("🖕");
	
	await mention
		.kick(reason ? reason : "")
		.then(() => {
			interaction.Reply({
				embeds: [
					Embed({
						title: ":hammer: | Pomyślnie wyrzucono",
						color: "#1F8B4C",
						description: `Wyrzucony: \`${mention.user.tag}\` (\`${mention.id}\`)\nModerator: \`${interaction.user.tag}\` (\`${interaction.user.id}\`)\nPowód: \`${reason || "Brak"}\``,
						user: interaction.user,
					}),
				],
			});
		})
		.catch(() => {
			interaction.Reply({ embeds: [ErrorEmbedInteraction(interaction, "Nie udało się wyrzucić tego użytkownika!")] });
		});
}

export const info: CommandInfo = {
	triggers: ["kick"],
	description: "Wyrzuć osobę",
	permissions:
		PermissionFlagsBits.KickMembers,
	builder: new SlashCommandBuilder()
		.addUserOption(option => option.setName("mention").setDescription("Użytkownik do wyrzucenia").setRequired(true))
		.addStringOption(option => option.setName("reason").setDescription("Powód wyrzucenia").setRequired(false))
		.setName("kick"),
};
