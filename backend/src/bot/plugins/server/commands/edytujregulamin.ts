import { SlashCommandBuilder } from "discord.js";
import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";

export default async function ({ message, args }: CommandArgs) {
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

	const fetchedMessage = await fetchedChannel.messages.fetch(args[1]).catch();

	if (!fetchedMessage || typeof fetchedMessage == "boolean")
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
				}) as unknown;

			fetchedMessage
				.edit({
					embeds: [
						Embed({
							title: "Regulamin serwera 4RDM",
							color: "#6f42c1",
							description: collectedMessages.first()?.content,
							footer: `© 2020-${new Date().getUTCFullYear()}`,
							user: message.author,
						}),
					],
				})
				.catch(err => {
					message.channel.send({
						embeds: [ErrorEmbed(message, err)],
					});
				});
		})
		.catch(() => {
			message.channel.send({
				embeds: [ErrorEmbed(message, "Niewprowadzono wiadomości!")],
			});
		});
}

export const info: CommandInfo = {
	triggers: ["edytujregulamin"],
	description: "Edytuje regulamin",
	permissions: ["Administrator"],
	builder: new SlashCommandBuilder()
		.addChannelOption(option =>
			option
				.setName("channel")
				.setDescription("Kanał, w którym znajduje się wiadomość")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("message")
				.setDescription("ID wiadomości")
				.setRequired(true)
		)
		.setName("edytujregulamin"),
};
