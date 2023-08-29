import { AutocompleteInteraction, SlashCommandBuilder } from "discord.js";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";
import { Roles as Rl } from "../../../constants";


export default async function ({ client, interaction }: CommandArgs) {
	if (!interaction.isChatInputCommand()) return;

	if (!interaction.channel)
		return interaction.Reply({ embeds: [ErrorEmbedInteraction(interaction, "Polecenie dostępne jedynie na kanale!")] });

	const channel = await interaction.channel.fetch(true);

	if (!channel.isTextBased() || channel.isDMBased())
		return interaction.Reply({ embeds: [ErrorEmbedInteraction(interaction, "Nie można użyć tego polecenia na tym kanale!")] });

	if (!channel.name.startsWith("ticket"))
		return interaction.Reply({ embeds: [ErrorEmbedInteraction(interaction, "Nie można użyć tego polecenia poza ticketami!")] });

	const status = interaction.options.getString("status", true);
	const channelName = channel.name.split("-").splice(0, 2);

	try {
		await channel.setName(`${channelName.join("-")}-${status.split(" ").join("-")}`);
		interaction.Reply({ embeds: [Embed({ color: "#1F8B4C", title: ":white_check_mark: | Zmieniono status ticketa" })] });
	} catch(err) {
		interaction.Reply({ embeds: [ErrorEmbedInteraction(interaction, "Wystąpił błąd, sprawdź konsolę!")] });
		client.logger.error(err);
	}
}

export async function autocomplete(client: CommandArgs["client"], interaction: AutocompleteInteraction) {
	const response = [
		{
			name: "gotowe",
			value: "done"
		},
		{
			name: "do wgrania",
			value: "upld"
		},
		{
			name: "trwa praca",
			value: "work"
		},
		{
			name: "czeka na realizacje",
			value: "wait"
		}
	];

	await interaction.respond(response);
}

export const info: CommandInfo = {
	triggers: ["rename"],
	description: "Zmienia status ticketa",
	role: Rl.DeveloperTeam,
	builder: new SlashCommandBuilder()
		.addStringOption(option => option.setName("status").setDescription("Status ticketa").setAutocomplete(true).setRequired(true))
		.setName("rename"),
};
