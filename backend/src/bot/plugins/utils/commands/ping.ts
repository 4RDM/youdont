import { Embed } from "../../../../utils/discordEmbed";
import { CommandArgs } from "../../../../types";

export const execute = async function({ client, message }: CommandArgs) {
	const embed = Embed({
		title: "Ping bota",
		description: `\`\`\`API: ${Math.floor(client.ws.ping)}ms\nWiadomość: ${Date.now() - message.createdTimestamp}ms\`\`\``,
		user: message.author,
	});

	message.channel.send({ embeds: [embed] });
};

export const info = {
	triggers: ["ping"],
	description: "Sprawdź opóźnienie API bota",
};