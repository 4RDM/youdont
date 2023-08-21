import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Embed } from "../../../../utils/discordEmbed";
import { Roles } from "../../../constants";

// prettier-ignore
export default async function ({ client, interaction }: CommandArgs) {
	if (!interaction.isChatInputCommand()) return;
	if (!interaction.inGuild()) return;

	const guild = await client.guilds.fetch(interaction.guildId);
	const mention = interaction.options.getUser("mention", true);
	const user = await guild.members.fetch(mention.id);
	const isTrial = interaction.options.getBoolean("trial", false);

	if (!isTrial)
		user.roles.add("932345054142529538");
	else
		user.roles.add("1019319109932032011");
	
	const embed = Embed({
		title: ":white_check_mark: | Nadano houndsa!",
		color: "#1F8B4C",
	});

	interaction.Reply({ embeds: [embed] });
}

export const info: CommandInfo = {
	triggers: ["dodajhoundsa"],
	description: "Dodaj hounds",
	permissions: PermissionFlagsBits.Administrator,
	role: [Roles.Owner, Roles.Zarzad, Roles.HeadAdmin, Roles.OpiekunHounds],
	builder: new SlashCommandBuilder()
		.addUserOption(option =>
			option
				.setName("mention")
				.setDescription("Użytkownik")
				.setRequired(true)
		)
		.addBooleanOption(option =>
			option
				.setName("trial")
				.setDescription("Czy ma być trial?")
				.setRequired(false)
		)
		.setName("dodajhoundsa"),
};
