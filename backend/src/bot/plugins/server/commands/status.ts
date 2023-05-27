import { getPlayers } from "../../../../utils/serverStatus";
import { Embed } from "../../../../utils/discordEmbed";
import { SlashCommandBuilder } from "discord.js";

// prettier-ignore
export default async function ({ client, interaction }: CommandArgs) {
	const status = await getPlayers();

	if (!status)
		interaction.reply({
			embeds: [Embed({ title: ":x: | 4RDM jest offline!", color: "#f54242", user: interaction.user })],
		});
	else
		interaction.reply({
			embeds: [
				Embed({
					title: ":white_check_mark: | 4RDM jest online!",
					description: `**Graczy online:** ${status.length}/${client.config.maxPlayers}\n\n${status.map((x) => `${x.id}. ${x.name}`).join("\n")}`,
					color: "#1F8B4C",
					user: interaction.user,
				}),
			],
		});
}

export const info: CommandInfo = {
	triggers: ["status"],
	description: "Wyświetla status serwera",
	builder: new SlashCommandBuilder().setName("status"),
};
