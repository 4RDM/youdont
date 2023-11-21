import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { getUserHex } from "./hex";
import {
    CommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { Roles, embedColors } from "utils/constants";
import { DBUser } from "database/playerData";
import { Embed } from "utils/embedBuilder";
import { readFile } from "fs/promises";

const filePath = join(
    "/home/rdm/server/data/resources/[4rdm]/4rdm/data/auta/shared.json"
);

export const awaitMessage = (
    interaction: CommandInteraction
): Promise<string> => {
    const promise = new Promise<string>((resolve, reject) => {
        interaction.channel
            ?.awaitMessages({
                filter: msg => msg.author.id === interaction.user.id,
                max: 1,
                time: 60000,
                errors: [ "time" ],
            })
            .then(collected => {
                if (!collected || !collected.first())
                    return reject("Nie wprowadzono odpowiedzi");

                resolve(collected.first()?.content || "");
            })
            .catch(() => {
                reject("Nie wprowadzono odpowiedzi");
            });
    });

    return promise;
};

export const selectUserHex = async(userHexes: DBUser[] | null, interaction: CommandInteraction) => {
    if (!userHexes) {
        interaction.Error("Wystąpił błąd bazy danych", { ephemeral: true });

        return false;
    }

    if (!userHexes[0]) {
        interaction.Error("Nie znaleziono gracza!", { ephemeral: true });

        return false;
    }

    if (userHexes.length == 1) return userHexes[0].identifier;

    const identifiers = userHexes;
    let awaitedMessage;

    await interaction.Reply(`\`\`\`Znalezione identyfikatory:\n${identifiers.map((x, i: number) => `${i + 1}. ${x?.identifier}`).join("\n")}\`\`\`\nKtóry z nich użyć?`);

    try {
        awaitedMessage = await awaitMessage(interaction);
    } catch (e) {
        interaction.Error("Nie wprowadzono odpowiedzi");

        return false;
    }

    let index = parseInt(awaitedMessage);

    if (isNaN(index)) {
        interaction.Error("Wprowadzono błędny index, nie jest cyfrą!");

        return false;
    }

    const currentHex = identifiers[--index]?.identifier;

    if (!currentHex) {
        interaction.Error("Wybrano błędny hex!");

        return false;
    }

    return currentHex;
};

export default async function ({ client, interaction }: CommandArgs) {
    if (!existsSync(filePath))
        return await interaction.Error("Funkcja niedostępna na tym komputerze!", { ephemeral: true });

    if (!interaction.isChatInputCommand()) return;

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
            title: ":white_check_mark: | Dodano auto współdzielone!",
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
            return await interaction.Error(`Nie znaleziono aut współdzielonych o nazwie \`${spawnName}\`!`, { ephemeral: true });
        }

        userJson[currentHex].splice(index, 1);

        writeFileSync(filePath, JSON.stringify(userJson), { encoding: "utf-8" });

        const embed = Embed({
            title: ":x: | Usunięto auto współdzielone!",
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

        if (!userHexes)
            return await interaction.Error("Wystąpił błąd bazy danych", { ephemeral: true });

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

        return await interaction.Reply([
            Embed({
                author: {
                    name: mention.username,
                    iconURL: mention.displayAvatarURL(),
                },
                user: interaction.user,
                title: "Auta współdzielone użytkownika",
                description: description.join("\n"),
            }),
        ]);
    }
}

export const info: CommandInfoType = {
    name: "shared",
    description: "Zarządzanie autami współdzielonymi graczy",
    permissions: PermissionFlagsBits.Administrator,
    role: [ Roles.Zarzad, Roles.HeadAdmin, Roles.Developer ],
    builder: new SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName("dodaj")
                .setDescription("Dodaje współdzielone auto")
                .addUserOption(option => option.setName("mention").setDescription("Użytkownik").setRequired(true))
                .addStringOption(option => option.setName("spawn-name").setDescription("Spawn name").setRequired(true))
                .addStringOption(option => option.setName("display-name").setDescription("Nazwa wyświetlana limitki").setRequired(true))
                .addStringOption(option => option.setName("hex").setDescription("Hex użytkownika").setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("usun")
                .setDescription("Usuwa współdzielone auto")
                .addUserOption(option => option.setName("mention").setDescription("Użytkownik").setRequired(true))
                .addStringOption(option => option.setName("spawn-name").setDescription("Spawn name").setRequired(true))
                .addStringOption(option => option.setName("hex").setDescription("Hex użytkownika").setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("lista")
                .setDescription("Lista współdzielonych aut")
                .addUserOption(option => option.setName("mention").setDescription("Użytkownik").setRequired(true))
        )
        .setName("shared"),
};
