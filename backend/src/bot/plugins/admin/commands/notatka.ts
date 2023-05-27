import { SlashCommandBuilder } from "discord.js";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";

export default async function ({ interaction, client }: CommandArgs) {
	if (!interaction.isChatInputCommand()) return;

	const subcommand = interaction.options.getSubcommand();

	if (subcommand === "dodaj") {
		const mention = interaction.options.getUser("mention", true);
		const content = interaction.options.getString("content", true);
		const dbUser = await client.Core.database.users.get(mention.id);

		if (!dbUser)
			return interaction.reply({
				embeds: [
					ErrorEmbedInteraction(
						interaction,
						"Nieznaleziono użytkownika w bazie danych!"
					),
				],
			});

		// prettier-ignore
		const notatka = {
			id: (parseInt(dbUser.notatki[dbUser.notatki.length - 1]?.id || "0") + 1).toString(),
			content,
			authorID: interaction.user.id,
			date: Math.floor(Date.now() / 1000),
		};

		dbUser.notatki.push(notatka);
		await dbUser.save();

		interaction.reply({
			embeds: [
				Embed({
					title: ":pencil: | Dodano notatkę!",
					color: "#1F8B4C",
					user: interaction.user,
				}),
			],
		});
	} else if (subcommand === "usun") {
		const mention = interaction.options.getUser("mention", true);
		const id = interaction.options.getInteger("id", true);
		const dbUser = await client.Core.database.users.get(mention.id);

		if (!dbUser)
			return interaction.reply({
				embeds: [
					ErrorEmbedInteraction(
						interaction,
						"Nieznaleziono użytkownika w bazie danych!"
					),
				],
			});

		// prettier-ignore
		const notatka = dbUser?.notatki.find(x => x.id.toString() === id.toString());

		if (!notatka)
			return interaction.reply({
				embeds: [
					ErrorEmbedInteraction(
						interaction,
						"Nie znaleziono notatki"
					),
				],
			});

		// prettier-ignore
		const notatki = dbUser?.notatki.filter(x => x.id.toString() !== id.toString());

		dbUser.notatki = notatki;
		await dbUser.save();

		const description: string[] = [];

		// prettier-ignore
		dbUser?.notatki.forEach((notatka) => {
			description.push(`**#${notatka.id}** | \`${notatka.content.substring(0, 20)}...\` ${notatka.authorID ? `- <@${notatka.authorID}>` : ""} ${notatka.date ? `- <t:${notatka.date}>` : ""}`);
		});

		interaction.reply({
			embeds: [
				Embed({
					title: ":coffin: | Usunięto notatke!",
					color: "#f54242",
					user: interaction.user,
					description: `Pozostałe notatki:\n${description.join(
						"\n"
					)}`,
				}),
			],
		});
	} else if (subcommand === "lista") {
		const mention = interaction.options.getUser("mention", true);
		const dbUser = await client.Core.database.users.get(mention.id);

		if (!dbUser)
			return interaction.reply({
				embeds: [
					ErrorEmbedInteraction(
						interaction,
						"Nieznaleziono użytkownika w bazie danych!"
					),
				],
			});

		const description: string[] = [];

		// prettier-ignore
		dbUser.notatki.forEach((notatka) => {
			description.push(`**#${notatka.id}** | \`${notatka.content.substring(0, 20)}...\` ${notatka.authorID ? `- <@${notatka.authorID}>` : ""} ${notatka.date ? `- <t:${notatka.date}>` : ""}`);
		});

		interaction.reply({
			embeds: [
				Embed({
					author: {
						name: mention.tag,
						iconURL: mention.displayAvatarURL(),
					},
					user: interaction.user,
					title: "Notatki dla użytkownika",
					description: description.join("\n"),
				}),
			],
		});
	} else if (subcommand === "wyswietl") {
		const mention = interaction.options.getUser("mention", true);
		const id = interaction.options.getInteger("id", true);
		const dbUser = await client.Core.database.users.get(mention.id);

		if (!dbUser)
			return interaction.reply({
				embeds: [
					ErrorEmbedInteraction(
						interaction,
						"Nieznaleziono użytkownika w bazie danych!"
					),
				],
			});

		const notatka = dbUser.notatki.find(x => x.id == id.toString());

		if (!notatka)
			return interaction.reply({
				embeds: [
					ErrorEmbedInteraction(
						interaction,
						`Nie znaleziono notatki od id ${id || "brak"}`
					),
				],
			});

		interaction.reply({
			embeds: [
				Embed({
					author: {
						name: mention.tag,
						iconURL: mention.displayAvatarURL(),
					},
					user: interaction.user,
					title: `Notatka #${notatka.id}`,
					description: `\`\`\`${notatka.content}\`\`\``,
				}),
			],
		});
	}
}

export const info: CommandInfo = {
	triggers: ["notatka", "note", "n"],
	description: "Notatki",
	permissions: ["BanMembers", "KickMembers"],
	builder: new SlashCommandBuilder()
		.addSubcommand(subcommand =>
			subcommand
				.setName("dodaj")
				.setDescription("Dodaj notatkę")
				.addUserOption(option =>
					option
						.setName("mention")
						.setDescription("Użytkownik")
						.setRequired(true)
				)
				.addStringOption(option =>
					option
						.setName("content")
						.setDescription("Treść notatki")
						.setRequired(true)
						.setMinLength(2)
						.setMaxLength(500)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("usun")
				.setDescription("Usuń notatkę")
				.addUserOption(option =>
					option
						.setName("mention")
						.setDescription("Użytkownik")
						.setRequired(true)
				)
				.addIntegerOption(option =>
					option
						.setName("id")
						.setDescription("ID notatki")
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("lista")
				.setDescription("Lista notatek")
				.addUserOption(option =>
					option
						.setName("mention")
						.setDescription("Użytkownik")
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("wyswietl")
				.setDescription("Wyswietl notatkę")
				.addUserOption(option =>
					option
						.setName("mention")
						.setDescription("Użytkownik")
						.setRequired(true)
				)
				.addIntegerOption(option =>
					option
						.setName("id")
						.setDescription("ID notatki")
						.setRequired(true)
				)
		)
		.setName("notatka"),
};
