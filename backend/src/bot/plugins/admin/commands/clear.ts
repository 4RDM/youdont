import { TextChannel } from "discord.js";
import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";

export const execute = async function ({ message, args }: CommandArgs) {
	const parsedNumber = parseInt(args[0]);
	if (
		!args[0] ||
		isNaN(parsedNumber) ||
		parsedNumber > 100 ||
		parsedNumber < 0
	)
		return message.channel.send({
			embeds: [
				ErrorEmbed(
					message,
					"Prawidłowe użycie: `.clear <ilosc-wiadomosci>`"
				),
			],
		});

	const messages = await message.channel.messages.fetch({
		limit: parsedNumber,
	});

	try {
		await (<TextChannel>message.channel).bulkDelete(messages);
		message.channel.send({
			embeds: [
				Embed({
					color: "#1F8B4C",
					title: ":broom: Brooooom",
					description: `Usunięto **${parsedNumber}** wiadomości!`,
					user: message.author,
				}),
			],
		});
	} catch (err) {
		message.channel.send({
			embeds: [
				Embed({
					color: "#E74C3C",
					title: ":broom: Brooooom",
					description:
						"**Wystąpił błąd podczas usuwania wiadomości**",
					user: message.author,
				}),
			],
		});
	}
};

export const info: Command["info"] = {
	triggers: ["clear", "purge", "wyczysc"],
	description: "Usuwa określoną ilość wiadomości",
	permissions: ["ManageMessages"],
};
