import {
	ChannelType,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "discord.js";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";
import { Roles } from "src/bot/constants";

// prettier-ignore
export default async function ({ interaction }: CommandArgs) {
	if (!interaction.isChatInputCommand()) return;

	const channel = interaction.options.getChannel<ChannelType.GuildText>("channel", true);
	const message = interaction.options.getString("message", true);

	const fetchedMessage = await channel.messages.fetch(message).catch();

	if (!fetchedMessage)
		return interaction.Reply({
			embeds: [ErrorEmbedInteraction(interaction, "Nieznaleziono wiadomości")],
		});

	interaction.Reply({
		embeds: [
			Embed({
				title: ":hourglass: | Wprowadź wiadomość",
				user: interaction.user,
			}),
		],
	});

	await interaction.channel?.awaitMessages({
		filter: msg => msg.author.id === interaction.user.id,
		max: 1,
		time: 60000,
		errors: ["time"],
	})
		.then(collectedMessages => {
			if (!collectedMessages.first()?.content)
				return interaction.Reply({
					embeds: [ErrorEmbedInteraction(interaction, "Niewprowadzono wiadomości!")],
				}) as unknown;

			fetchedMessage
				.edit({
					embeds: [
						Embed({
							title: "Regulamin serwera 4RDM",
							color: "#6f42c1",
							description: collectedMessages.first()?.content,
							footer: `© 2020-${new Date().getUTCFullYear()}`,
						}),
					],
				})
				.catch(err => {
					interaction.Reply({
						embeds: [ErrorEmbedInteraction(interaction, err)],
					});
				});
		})
		.catch(() => {
			interaction.Reply({
				embeds: [ErrorEmbedInteraction(interaction, "Niewprowadzono wiadomości!")],
			});
		});
}

export const info: CommandInfo = {
	triggers: ["edytujregulamin"],
	description: "Edytuje regulamin",
	permissions: PermissionFlagsBits.Administrator,
	role: [Roles.Owner],
	builder: new SlashCommandBuilder()
		.addChannelOption(option =>
			option
				.addChannelTypes(ChannelType.GuildText)
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
