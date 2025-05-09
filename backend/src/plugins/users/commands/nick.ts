import {
    HexColorString,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { getUserHex } from "./hex";
import { selectUserHex } from "./shared";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import hexToRGB from "utils/hexToRGB";
import { Embed, ErrorEmbedInteraction } from "utils/embedBuilder";
import { Roles, embedColors } from "utils/constants";
import rcon from "utils/rcon";
import { readFile } from "fs/promises";

export interface Role {
    tag: string;
    r: number;
    g: number;
    b: number;
    comment: string;
}

export interface Roles extends Array<{ [k: `steam:${string}`]: Role }> {
    [k: `steam:${string}`]: Role;
}

const filePath = join("/home/rdm/server/data/resources/[core]/chat_beta/data/roles.json");

export default async function ({ client, interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;

    if (!existsSync(filePath))
        return await interaction.Error("Funkcja niedostępna na tym komputerze!", { ephemeral: true });

    const mention = interaction.options.getUser("mention", true);
    const color = interaction.options.getString("kolor", true);
    const prefix = interaction.options.getString("prefix", true);

    if (!color.startsWith("#") || color.length !== 7 || !color.match(/^#[0-9a-fA-F]+$/))
        return await interaction.Error("Niepoprawny format koloru", { ephemeral: true });

    const file = await readFile(filePath, { encoding: "utf-8" });
    const json = JSON.parse(file) as Roles;

    const rolesJson = json;

    if (!rolesJson)
        return await interaction.Error("Wystąpił błąd bazy danych (KOD: RLSJS)", { ephemeral: true });

    const userHexes = await getUserHex(client, mention.id);

    if (userHexes === false)
        return await interaction.Error("Wystąpił błąd bazy danych (KOD: UHSDB)", { ephemeral: true });

    const currentHex = await selectUserHex(userHexes, interaction);

    if (currentHex === false) return;

    const { r, g, b } = hexToRGB(color as HexColorString);
    rolesJson[`${currentHex as `steam:${string}`}`] = { tag: prefix, r, g, b, comment: `${mention.tag} (${mention.id})` };

    writeFileSync(filePath, JSON.stringify(rolesJson, null, "\t"), { encoding: "utf-8" });

    const embed = Embed({
        title: ":white_check_mark: | Zmieniono przedrostek",
        color: embedColors.green,
        description: `Zmieniono przedrostek gracza ${mention.tag} (${mention.id}) na ${prefix}`,
        user: interaction.user,
    });

    interaction.Reply([ embed ]);

    return await rcon("reloadchat")
        .catch(() => {
            interaction.editReply({ embeds: [ ErrorEmbedInteraction(interaction, "Nie udało się wysłać polecenia") ] });
        });
}

export const info: CommandInfoType = {
    name: "nick",
    description: "Zmień przedrostek gracza",
    permissions: PermissionFlagsBits.Administrator,
    role: Roles.NickTeam,
    builder: new SlashCommandBuilder()
        .addUserOption(option => option.setName("mention").setDescription("Użytkownik").setRequired(true))
        .addStringOption(option => option.setName("kolor").setDescription("Kolor nicku (hex)").setRequired(true))
        .addStringOption(option => option.setName("prefix").setDescription("Nowy przedrostek").setRequired(true))
        .setName("nick"),
};
