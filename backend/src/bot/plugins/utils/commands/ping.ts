import { Embed } from "../../../../utils/discordEmbed";
import { Command } from "../../../../types";

const command: Command = {
	triggers: ["ping"],
	description: "Sprawdź opóźnienie API bota",
	async exec(client, message) {
		const embed = Embed({
			title: "Ping bota",
			description: `\`\`\`API: ${Math.floor(
				client.ws.ping
			)}ms\nWiadomość: ${Date.now() - message.createdTimestamp}ms\`\`\``,
			user: message.author,
		});
		message.channel.send({ embeds: [embed] });
	},
};

module.exports = command;
