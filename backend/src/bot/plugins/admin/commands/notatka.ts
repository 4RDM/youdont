import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";

// prettier-ignore
export default async function ({ interaction, client }: CommandArgs) {
	if (!interaction.isChatInputCommand()) return;

	const subcommand = interaction.options.getSubcommand();

	if (subcommand === "dodaj") {
		const mention = interaction.options.getUser("mention", true);
		const content = interaction.options.getString("content", true);
		const dbUser = await client.core.database.users.get(mention.id);

		if (!dbUser)
			return interaction.Reply({
				embeds: [
					ErrorEmbedInteraction(
						interaction,
						"Nieznaleziono użytkownika w bazie danych!"
					),
				],
			});

		const note = await client.core.database.notes.create(mention.id, interaction.user.id, content);

		if (!note)
			return interaction.Reply({
				embeds: [
					ErrorEmbedInteraction(
						interaction,
						"Wystąpił wewnętrzny błąd bota (KOD: COMMAND_NOTE_ADD_DB_ERROR). Spróbuj ponownie później / skontaktuj się z administracją!"
					),
				],
			});

		interaction.Reply({
			embeds: [
				Embed({
					title: ":pencil: | Dodano notatkę!",
					description: `ID utworzonej notatki: ${note.noteID}`,
					color: "#1F8B4C",
					user: interaction.user,
				}),
			],
		});
	} else if (subcommand === "usun") {
		const mention = interaction.options.getUser("mention", true);
		const id = interaction.options.getInteger("id", true);
		const dbUser = await client.core.database.users.get(mention.id);

		if (!dbUser)
			return interaction.Reply({
				embeds: [
					ErrorEmbedInteraction(
						interaction,
						"Nieznaleziono użytkownika w bazie danych!"
					),
				],
			});

		const response = await client.core.database.notes.delete(mention.id, id);

		if (!response)
			return interaction.Reply({
				embeds: [
					ErrorEmbedInteraction(
						interaction,
						"Wystąpił wewnętrzny błąd bota (KOD: COMMAND_NOTE_DELETE_DB_ERROR). Spróbuj ponownie później / skontaktuj się z administracją!"
					),
				],
			});

		interaction.Reply({
			embeds: [
				Embed({
					title: ":coffin: | Usunięto notatke!",
					color: "#f54242",
					user: interaction.user,
				}),
			],
		});
	} else if (subcommand === "lista") {
		const mention = interaction.options.getUser("mention", true);
		const dbUser = await client.core.database.users.get(mention.id);

		if (!dbUser)
			return interaction.Reply({
				embeds: [
					ErrorEmbedInteraction(
						interaction,
						"Nieznaleziono użytkownika w bazie danych!"
					),
				],
			});

		const description: string[] = [];

		// prettier-ignore
		dbUser.notes.forEach((note) => {
			description.push(`**#${note.noteID}** | \`${note.content.substring(0, 20)}...\` ${note.authorID ? `- <@${note.authorID}>` : ""} ${note.createdAt ? `- <t:${new Date(note.createdAt).getTime() / 1000}>` : "" }`);
		});

		interaction.Reply({
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
		const dbUser = await client.core.database.users.get(mention.id);

		if (!dbUser)
			return interaction.Reply({
				embeds: [
					ErrorEmbedInteraction(
						interaction,
						"Nieznaleziono użytkownika w bazie danych!"
					),
				],
			});

		const notatka = dbUser.notes.find(x => x.noteID == id);

		if (!notatka)
			return interaction.Reply({
				embeds: [
					ErrorEmbedInteraction(
						interaction,
						`Nie znaleziono notatki od id ${id || "brak"}`
					),
				],
			});

		interaction.Reply({
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
	permissions:
		PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers,
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
