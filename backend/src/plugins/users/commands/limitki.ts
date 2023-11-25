import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { getUserHex } from "./hex";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { selectUserHex } from "./shared";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { Embed } from "utils/embedBuilder";
import { Roles, embedColors } from "utils/constants";
import { readFile } from "fs/promises";

const filePath = join(
    // __dirname,
    // "vehicles.json"
    "/home/rdm/server/data/resources/[4rdm]/4rdm/data/auta/vehicles.json"
);

export default async function ({ client, interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;

    if (!existsSync(filePath))
        return await interaction.Error("Funkcja niedostępna na tym komputerze!");

    const file = await readFile(filePath, { encoding: "utf-8" });
    const json = JSON.parse(file);

    const subcommand = interaction.options.getSubcommand();
    const userJson = json;
    const mention = interaction.options.getUser("mention", true);
    const hexOverride = interaction.options.getString("hex", false);

    if (subcommand === "dodaj") {
        const spawnName = interaction.options.getString("spawn-name", true);
        const displayName = interaction.options.getString("display-name", true);
        const userHexes = await getUserHex(client, mention.id);

        if (userHexes === false)
            return await interaction.Error("Wystąpił błąd bazy danych (KOD: UHSDB)", { ephemeral: true });

        const currentHex = hexOverride || await selectUserHex(userHexes, interaction);

        if (!currentHex) return;

        if (!userJson[currentHex]) userJson[currentHex] = [];
        userJson[currentHex].push([ spawnName, displayName ]);

        writeFileSync(filePath, JSON.stringify(userJson), { encoding: "utf-8" });

        const embed = Embed({
            title: ":white_check_mark: | Dodano limitkę!",
            color: embedColors.green,
            author: {
                name: mention.tag,
                iconURL: mention.displayAvatarURL(),
            },
            description: `**Hex**: \`${currentHex}\`\n**Spawn name**: \`${spawnName}\`\n**Display name**: \`${displayName}\``,
            user: interaction.user,
        });

        return await interaction.Reply([ embed ]);
    } else if (subcommand === "usun") {
        const spawnName = interaction.options.getString("spawn-name", true);
        const userHexes = await getUserHex(client, mention.id);

        if (userHexes === false)
            return await interaction.Error("Wystąpił błąd bazy danych (KOD: UHSDB)", { ephemeral: true });

        const currentHex = hexOverride || await selectUserHex(userHexes, interaction);

        if (!currentHex) return;

        const index = userJson[currentHex].findIndex((x: string[]) => x[0] == spawnName);
        if (index == -1) {
            return await interaction.Error(`Nie znaleziono limitki o nazwie \`${spawnName}\`!`, { ephemeral: true });
        }

        userJson[currentHex].splice(index, 1);

        writeFileSync(filePath, JSON.stringify(userJson), { encoding: "utf-8" });

        const embed = Embed({
            title: ":x: | Usunięto limitkę!",
            color: embedColors.red,
            author: {
                name: mention.tag,
                iconURL: mention.displayAvatarURL(),
            },
            description: `**Hex**: \`${currentHex}\`\n**Spawn name**: \`${spawnName}\``,
            user: interaction.user,
        });

        return await interaction.Reply([ embed ]);
    } else if (subcommand === "lista") {
        const userHexes = await getUserHex(client, mention.id);

        if (userHexes === false)
            return await interaction.Error("Wystąpił błąd bazy danych (KOD: UHSDB)", { ephemeral: true });

        if (!userHexes[0])
            return await interaction.Error("Nie znaleziono gracza!", { ephemeral: true });

        const limitki: { [key: string]: string[][] } = {};
        const description: string[] = [];

        userHexes.forEach((x) => {
            limitki[x?.identifier || ""] = userJson[x?.identifier || ""];
        });

        Array.from(Object.keys(limitki)).forEach((hex) => {
            if (limitki[hex]) {
                description.push(`**${hex}**:`);
                limitki[hex].forEach((limitka: string[]) => {
                    description.push(`\`${limitka[0]}\`: \`${limitka[1]}\``);
                });
            }
        });

        const embed = Embed({
            author: {
                name: mention.username,
                iconURL: mention.displayAvatarURL(),
            },
            user: interaction.user,
            title: "Limitki użytkownika",
            description: description.join("\n"),
        });

        interaction.Reply([ embed ]);
    }
}

export const info: CommandInfoType = {
    name: "limitki",
    description: "Zarządzanie limitkami graczy",
    permissions: PermissionFlagsBits.Administrator,
    role: [ Roles.Zarzad, Roles.HeadAdmin, Roles.Developer ],
    builder: new SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName("dodaj")
                .setDescription("Dodaje limitkę")
                .addUserOption(option => option.setName("mention").setDescription("Użytkownik").setRequired(true))
                .addStringOption(option => option.setName("spawn-name").setDescription("Spawn name").setRequired(true))
                .addStringOption(option => option.setName("display-name").setDescription("Nazwa wyświetlana limitki").setRequired(true))
                .addStringOption(option => option.setName("hex").setDescription("Hex użytkownika").setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("usun")
                .setDescription("Usuwa limitkę")
                .addUserOption(option => option.setName("mention").setDescription("Użytkownik").setRequired(true))
                .addStringOption(option => option.setName("spawn-name").setDescription("Spawn name").setRequired(true))
                .addStringOption(option => option.setName("hex").setDescription("Hex użytkownika").setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("lista")
                .setDescription("Lista limitek gracza")
                .addUserOption(option => option.setName("mention").setDescription("Użytkownik").setRequired(true))
        )
        .setName("limitki"),
};
