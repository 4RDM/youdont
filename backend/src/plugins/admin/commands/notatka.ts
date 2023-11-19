import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Embed } from "utils/embedBuilder";
import { Roles } from "utils/constants";
import { CommandArgs, CommandInfoType } from "handlers/commands";

export default async function ({ interaction, client }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "dodaj") {
        const mention = interaction.options.getUser("mention", true);
        const content = interaction.options.getString("content", true);

        const res = await client.database.users.create(mention.id);

        if (!res)
            return await interaction.Error("Wystąpił wewnętrzny błąd bota (KOD: CNCADE). Spróbuj ponownie później / skontaktuj się z administracją!", { ephemeral: true });

        const dbUser = client.database.users.get(mention.id);

        if (!dbUser)
            return await interaction.Error("Nieznaleziono użytkownika w bazie danych!", { ephemeral: true });

        const note = await client.database.notes.create(content, mention.id, interaction.user.id);

        if (!note)
            return await interaction.Error("Wystąpił wewnętrzny błąd bota (KOD: CNADE). Spróbuj ponownie później / skontaktuj się z administracją!", { ephemeral: true });

        return await interaction.Reply([
            Embed({
                title: ":pencil: | Dodano notatkę!",
                description: `ID utworzonej notatki: ${note.noteID}`,
                color: "#1F8B4C",
                user: interaction.user,
            }),
        ]);
    } else if (subcommand === "usun") {
        const mention = interaction.options.getUser("mention", true);
        const id = interaction.options.getInteger("id", true);

        const res = await client.database.users.create(mention.id);

        if (!res)
            return await interaction.Error("Wystąpił wewnętrzny błąd bota (KOD: CNCADE). Spróbuj ponownie później / skontaktuj się z administracją!", { ephemeral: true });

        const dbUser = client.database.users.get(mention.id);

        if (!dbUser)
            return await interaction.Error("Nieznaleziono użytkownika w bazie danych!", { ephemeral: true });

        const response = await client.database.notes.delete(id);

        if (!response)
            return await interaction.Error("Wystąpił wewnętrzny błąd bota (KOD: COMMAND_NOTE_DELETE_DB_ERROR). Spróbuj ponownie później / skontaktuj się z administracją!", { ephemeral: true });

        return await interaction.Reply([
            Embed({
                title: ":coffin: | Usunięto notatke!",
                color: "#f54242",
                user: interaction.user,
            }),
        ]);
    } else if (subcommand === "lista") {
        const mention = interaction.options.getUser("mention", true);

        const res = await client.database.users.create(mention.id);

        if (!res)
            return await interaction.Error("Wystąpił wewnętrzny błąd bota (KOD: CNCADE). Spróbuj ponownie później / skontaktuj się z administracją!", { ephemeral: true });

        const dbUser = client.database.users.get(mention.id);

        if (!dbUser)
            return await interaction.Error("Nieznaleziono użytkownika w bazie danych!", { ephemeral: true });

        const description: string[] = [];

        dbUser.getNotes().forEach((note) => {
            description.push(`**#${note.noteID}** | \`${note.content.substring(0, 20)}...\` ${note.author?.id ? `- <@${note.author?.id}>` : ""} ${note.createdAt ? `- <t:${Math.floor(new Date(note.createdAt).getTime() / 1000)}>` : "" }`);
        });

        return await interaction.Reply([
            Embed({
                author: {
                    name: mention.tag,
                    iconURL: mention.displayAvatarURL(),
                },
                user: interaction.user,
                title: "Notatki dla użytkownika",
                description: description.join("\n"),
            }),
        ]);
    } else if (subcommand === "wyswietl") {
        const mention = interaction.options.getUser("mention", true);
        const id = interaction.options.getInteger("id", true);

        const res = await client.database.users.create(mention.id);

        if (!res)
            return await interaction.Error("Wystąpił wewnętrzny błąd bota (KOD: CNCADE). Spróbuj ponownie później / skontaktuj się z administracją!", { ephemeral: true });

        const dbUser = client.database.users.get(mention.id);

        if (!dbUser)
            return await interaction.Error("Nieznaleziono użytkownika w bazie danych!", { ephemeral: true });

        const notatka = dbUser.getNotes().find(x => x.noteID == id);

        if (!notatka)
            return await interaction.Error(`Nie znaleziono notatki od id ${id || "brak"}`, { ephemeral: true });

        return await interaction.Reply([
            Embed({
                author: {
                    name: mention.tag,
                    iconURL: mention.displayAvatarURL(),
                },
                user: interaction.user,
                title: `Notatka #${notatka.noteID}`,
                description: `\`\`\`${notatka.content}\`\`\``,
            }),
        ]);
    }
}

export const info: CommandInfoType = {
    name: "notatka",
    description: "Notatki",
    permissions: PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers,
    role: Roles.NotatkaTeam,
    builder: new SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName("dodaj")
                .setDescription("Dodaj notatkę")
                .addUserOption(option => option.setName("mention").setDescription("Użytkownik").setRequired(true))
                .addStringOption(option => option.setName("content").setDescription("Treść notatki").setRequired(true).setMinLength(2).setMaxLength(500))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("usun")
                .setDescription("Usuń notatkę")
                .addUserOption(option => option.setName("mention").setDescription("Użytkownik").setRequired(true))
                .addIntegerOption(option => option.setName("id").setDescription("ID notatki").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("lista")
                .setDescription("Lista notatek")
                .addUserOption(option => option.setName("mention").setDescription("Użytkownik").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("wyswietl")
                .setDescription("Wyswietl notatkę")
                .addUserOption(option => option.setName("mention").setDescription("Użytkownik").setRequired(true))
                .addIntegerOption(option => option.setName("id").setDescription("ID notatki").setRequired(true))
        )
        .setName("notatka"),
};
