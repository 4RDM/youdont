import { Embed } from "../../../../utils/discordEmbed";
import { Command } from "../../../../types";

const command: Command = {
	triggers: ["serverinfo", "server"],
	description: "Sprawdź informacje o serwerze",
	async exec(client, message) {
		const embed = Embed({
			title: message.guild?.name,
			fields: [
				{
					name: "Użytkownicy",
					value:
						`\`${message.guild?.memberCount.toString()}\`` || "`0`",
					inline: true,
				},
				{
					name: "Bany",
					value:
						`\`${(
							await message.guild?.bans.fetch()
						)?.size.toString()}\`` || "`0`",
					inline: true,
				},
				{
					name: "Ilość kanałów",
					value:
						`\`${message.guild?.channels.cache.size.toString()}\`` ||
						"`0`",
					inline: true,
				},
				{
					name: "Ilość ról",
					value:
						`\`${message.guild?.roles.cache.size.toString()}\`` ||
						"`0`",
					inline: true,
				},
				{
					name: "Data utworzenia",
					value: `<t:${Math.floor(
						(message.guild?.createdAt.getTime() || Date.now()) /
							1000
					)}:R>`,
					inline: true,
				},
			],
			thumbnail: message.guild?.iconURL({ dynamic: true }) || "",
			user: message.author,
		});
		message.channel.send({ embeds: [embed] });
	},
};

module.exports = command;
