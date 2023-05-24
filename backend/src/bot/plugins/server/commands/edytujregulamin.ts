import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";
import { Command, CommandArgs } from "../../../../types";

export const execute = async function ({ message, args }: CommandArgs) {
	// prettier-ignore
	if (!args[0] || !args[1])
		return message.channel.send({ embeds: [ErrorEmbed(message, "Prawidłowe użycie komendy: <ID kanału> <ID wiadomości>")] });

	const fetchedChannel =
		message.mentions.channels.first() ||
		(await message.guild?.channels.fetch(args[0]));

	if (!fetchedChannel)
		return message.channel.send({
			embeds: [ErrorEmbed(message, "Nieznaleziono kanału")],
		});

	if (!fetchedChannel.isTextBased())
		return message.channel.send({
			embeds: [ErrorEmbed(message, "Kanał nie jest tekstowy")],
		});

	const fetchedMessage = await fetchedChannel.messages
		.fetch(args[1])
		.catch(() => false);

	if (!fetchedMessage)
		return message.channel.send({
			embeds: [ErrorEmbed(message, "Nieznaleziono wiadomości")],
		});

	message.channel.send({
		embeds: [
			Embed({
				title: ":hourglass: | Wprowadź wiadomość",
				user: message.author,
			}),
		],
	});

	await message.channel
		.awaitMessages({
			filter: msg => msg.author.id === message.author.id,
			max: 1,
			time: 60000,
			errors: ["time"],
		})
		.then(collectedMessages => {
			if (!collectedMessages.first()?.content)
				return message.channel.send({
					embeds: [ErrorEmbed(message, "Niewprowadzono wiadomości!")],
				}) as any;

			fetchedMessage.edit({
				embeds: [
					Embed({
						title: "Regulamin serwera 4RDM",
						description: collectedMessages.first()?.content,
						footer: `© 2020-${new Date().getUTCFullYear()}`,
						user: message.author,
					}),
				],
			});
		})
		.catch(
			() =>
				message.channel.send({
					embeds: [ErrorEmbed(message, "Niewprowadzono wiadomości!")],
				}) as any
		);
};

export const info: Command["info"] = {
	triggers: ["edytujregulamin"],
	description: "Edytuje regulamin",
	permissions: ["Administrator"],
};
