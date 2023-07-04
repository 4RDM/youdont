import { SlashCommandBuilder } from "discord.js";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";

// prettier-ignore
export default async function ({ client, interaction }: CommandArgs) {
	
	if (!interaction.isChatInputCommand()) return;
    if (!interaction.inGuild()) return interaction.Reply({ embeds: [ErrorEmbedInteraction(interaction, "Użytkownika nie ma na serwerze!")] });

	const guild = await client.guilds.fetch(interaction.guildId);
	const mention = interaction.options.getUser("mention", true);
    const user = await guild.members.fetch(mention.id);
	const benefit = interaction.options.getBoolean("trial", false);
	if (!benefit)
		user.roles.add('932345054142529538');
	else
		user.roles.add('1019319109932032011');
	
	const embed = Embed({
		title: ":white_check_mark: | Nadano houndsa!",
		color: "#1F8B4C",
	});

	interaction.Reply({ embeds: [embed] });
}

export const info: CommandInfo = {
	triggers: ["dodajhoundsa"],
	description: "Dodaj hounds",
	permissions: ["Administrator"],
	role: "962784956197765192", // opiekun hounds
	builder: new SlashCommandBuilder()
		.addUserOption(option =>
			option
				.setName("mention")
				.setDescription("Użytkownik")
				.setRequired(true)
		)
		.addBooleanOption(option =>
			option
				.setName('trial')
				.setDescription('Czy ma być trial?')
				.setRequired(false)

			)
		.setName("dodajhoundsa"),
};
