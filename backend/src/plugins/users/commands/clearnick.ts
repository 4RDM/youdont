import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { getUserHex } from "./hex";
import { selectUserHex } from "./shared";
import { Roles } from "./nick";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { Embed } from "utils/embedBuilder";
import { Roles as RL, embedColors } from "utils/constants";
import rcon from "utils/rcon";

const path = join("/home/rdm/server/data/resources/[4rdm]/4rdm/data/roles.json");

export default async function ({ client, interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;

    if (!existsSync(path))
        return await interaction.Error("Funkcja niedostępna na tym komputerze!", { ephemeral: true });

    const mention = interaction.options.getUser("mention", true);

    const rolesJson: Roles | null = (await import(path)).default;

    if (!rolesJson)
        return await interaction.Error("Wystąpił błąd podczas wczytywania plików!", { ephemeral: true });

    const userHexes = await getUserHex(client, mention.id);

    if (userHexes === false)
        return await interaction.Error("Wystąpił błąd bazy danych (KOD: UHSDB)", { ephemeral: true });

    const currentHex = await selectUserHex(userHexes, interaction);

    if (currentHex === false) return;

    delete rolesJson[currentHex as `steam:${string}`];

    writeFileSync(path, JSON.stringify(rolesJson, null, "\t"), { encoding: "utf-8" });

    const embed = Embed({
        title: ":x: | Wyczyszczono przedrostek",
        color: embedColors.red,
        user: interaction.user,
    });

    interaction.Reply([ embed ]);

    return await rcon("reloadchat");
}

export const info: CommandInfoType = {
    name: "clearnick",
    description: "Usun przedrostek gracza",
    permissions: PermissionFlagsBits.Administrator,
    role: RL.NickTeam,
    builder: new SlashCommandBuilder()
        .addUserOption(option => option.setName("mention").setDescription("Użytkownik").setRequired(true))
        .setName("clearnick"),
};
