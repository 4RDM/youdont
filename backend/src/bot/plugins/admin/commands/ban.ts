import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";
import { GuildMember, SlashCommandBuilder } from "discord.js";

// prettier-ignore
export default async function ({ interaction }: CommandArgs) {
	if (!interaction.isChatInputCommand()) return;

	const mention = interaction.options.getMember("mention") as GuildMember;
	const reason = interaction.options.getString("reason", false);

	if (!mention.bannable)
		return interaction.reply({
			embeds: [
				ErrorEmbedInteraction(
					interaction,
					"Nie udało się zbanować tego użytkownika!"
				),
			],
		});

	if (
		(mention.id == "594526434526101527" && interaction.user.id !== "364056796932997121") ||
		(mention.id == "364056796932997121" && interaction.user.id !== "594526434526101527")
	) return interaction.reply("🖕");

	await mention
		.ban({ reason: reason ? reason : "", deleteMessageSeconds: 12 * 60 * 60 })
		.then(user => {
			interaction.reply({
				embeds: [
					Embed({
						title: ":hammer: Banhammer",
						color: "#1F8B4C",
						description: `Zbanowany: \`${typeof user !== "string" ? user.id : user}\` (\`${mention.id}\`)\nModerator: \`${interaction.user.tag}\` (\`${interaction.user.id}\`)\nPowód: \`${reason || "Brak"}\``,
						user: interaction.user,
					}),
				],
			});
		})
		.catch(() => {
			interaction.reply({
				embeds: [
					ErrorEmbedInteraction(
						interaction,
						"Nie udało się zbanować tego użytkownika!"
					),
				],
			});
		});
}

export const info: CommandInfo = {
	triggers: ["ban"],
	description: "Zbanuj osobę",
	permissions: ["BanMembers", "KickMembers"],
	builder: new SlashCommandBuilder()
		.addUserOption(option =>
			option
				.setName("mention")
				.setDescription("Użytkownik do zbanowania")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("reason")
				.setDescription("Powód zbanowania")
				.setRequired(false)
		)
		.setName("ban"),
};
