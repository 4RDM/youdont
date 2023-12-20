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
import { readFile } from "fs/promises";

const filePath = join("/home/rdm/server/data/resources/[4rdm]/4rdm/data/roles.json");

export default async function ({ client, interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;

    if (!existsSync(filePath))
        return await interaction.Error("Funkcja niedostępna na tym komputerze!", { ephemeral: true });

    const mention = interaction.options.getUser("mention", true);

    const file = await readFile(filePath, { encoding: "utf-8" });
    const json = JSON.parse(file) as Roles;

    const rolesJson: Roles | null = json;

    if (!rolesJson)
        return await interaction.Error("Wystąpił błąd podczas wczytywania plików!", { ephemeral: true });

    const userHexes = await getUserHex(client, mention.id);

    if (userHexes === false)
        return await interaction.Error("Wystąpił błąd bazy danych (KOD: UHSDB)", { ephemeral: true });

    const currentHex = await selectUserHex(userHexes, interaction);

    console.log(currentHex);

    if (currentHex === false) return;

    delete rolesJson[currentHex as `steam:${string}`];

    writeFileSync(filePath, JSON.stringify(rolesJson, null, "\t"), { encoding: "utf-8" });

    console.log(interaction);
    
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
