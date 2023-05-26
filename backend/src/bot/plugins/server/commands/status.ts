import { getPlayers } from "../../../../utils/serverStatus";
import { Embed } from "../../../../utils/discordEmbed";
import { SlashCommandBuilder } from "discord.js";

// prettier-ignore
export default async function ({ client, message }: CommandArgs) {
	const status = await getPlayers();

	if (!status)
		message.channel.send({
			embeds: [Embed({ title: ":x: | 4RDM jest offline!", color: "#f54242", user: message.author })],
		});
	else
		message.channel.send({
			embeds: [
				Embed({
					title: ":white_check_mark: | 4RDM jest online!",
					description: `**Graczy online:** ${status.length}/${client.config.maxPlayers}\n\n${status.map((x) => `${x.id}. ${x.name}`).join("\n")}`,
					color: "#1F8B4C",
					user: message.author,
				}),
			],
		});
}

export const info: CommandInfo = {
	triggers: ["status"],
	description: "Wyświetla status serwera",
	builder: new SlashCommandBuilder().setName("status"),
};
