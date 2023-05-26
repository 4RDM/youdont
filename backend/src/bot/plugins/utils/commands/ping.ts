import { SlashCommandBuilder } from "discord.js";
import { Embed } from "../../../../utils/discordEmbed";

export default async function ({ client, message }: CommandArgs) {
	const embed = Embed({
		title: "Ping bota",
		description: `\`\`\`API: ${Math.floor(client.ws.ping)}ms\nWiadomość: ${
			Date.now() - message.createdTimestamp
		}ms\`\`\``,
		user: message.author,
	});

	message.channel.send({ embeds: [embed] });
}

export const info: CommandInfo = {
	triggers: ["ping"],
	description: "Sprawdź opóźnienie API bota",
	builder: new SlashCommandBuilder().setName("ping"),
};
