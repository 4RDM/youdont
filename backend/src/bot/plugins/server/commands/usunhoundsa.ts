import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";
import { Roles } from "../../../constants";

// prettier-ignore
export default async function ({ client, interaction }: CommandArgs) {
	
	if (!interaction.isChatInputCommand()) return;
	if (!interaction.inGuild()) return interaction.Reply({ embeds: [ErrorEmbedInteraction(interaction, "Użytkownika nie ma na serwerze!")] });

	const guild = await client.guilds.fetch(interaction.guildId);
	const mention = interaction.options.getUser("mention", true);
	const user = await guild.members.fetch(mention.id);
	
	user.roles.remove("932345054142529538");
	user.roles.remove("1019319109932032011");

	const embed = Embed({
		title: ":x: | Usunięto houndsa!",
		color: "#f54242",
	});

	interaction.Reply({ embeds: [embed] });
}

export const info: CommandInfo = {
	triggers: ["usunhoundsa"],
	description: "Usuń hounds",
	permissions: PermissionFlagsBits.Administrator,
	role: [Roles.Owner, Roles.Zarzad, Roles.HeadAdmin, Roles.OpiekunHounds],
	builder: new SlashCommandBuilder()
		.addUserOption(option => option.setName("mention").setDescription("Użytkownik").setRequired(true))
		.setName("usunhoundsa"),
};
