import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";
import { Command } from "../../../../types";

const command: Command = {
	triggers: ["zaakceptuj"],
	description: "Zaakceptuj donate o danym ID",
	permissions: ["ADMINISTRATOR"],
	async exec(client, message, args) {
		if (!args[0] || !args[1])
			return message.channel.send({
				embeds: [ErrorEmbed(message, "Prawidłowe użycie: `.zaakceptuj <ID> <kwota>`")],
			});

		const donate = await client.Core.database.donates.get(parseInt(args[0]));

		if (donate && donate.dID && !donate.approved) {
			await client.Core.database.donates.approve(donate.dID, message.author.tag, args[1]);
			message.channel.send({
				embeds: [Embed({
					title: "Zaakceptowano wpłatę",
					description: `Zaakceptowano wpłatę o ID: \`${args[0]}\`, na kwotę: \`${args[1]}\``,
					color: "#1F8B4C",
					user: message.author,
				})],
			});
		} else if (donate && donate.approved) {
			message.channel.send({
				embeds: [ErrorEmbed(message, "Wpłata została już zaakceptowana")],
			});
		} else {
			message.channel.send({
				embeds: [ErrorEmbed(message, "Nie znaleziono donate")],
			});
		}
	}
};

module.exports = command;