import { existsSync } from "fs";
import { join } from "path";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { Embed } from "utils/embedBuilder";
import { Roles, embedColors } from "utils/constants";
import { readFile } from "fs/promises";

const filePath = join("/home/rdm/server/data/resources/[4rdm]/4rdm/data/auta/shared.json");

export default async function ({ interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;
    if (!existsSync(filePath))
        return await interaction.Error("Funkcja niedostępna na tym komputerze!");

    const file = await readFile(filePath, { encoding: "utf-8" });
    const json = JSON.parse(file);
    const sharedJson = json;
    const spawnName = interaction.options.getString("spawn-name", true);
    
    for (const hex in sharedJson) {
        const entries = sharedJson[hex];
        for (const respname of Object.values(entries)) {
            if ((respname as string).toLowerCase() === spawnName.toLowerCase()) {
                const embed = Embed({
                    title: ":white_check_mark: | Znaleziono wspóldzielenie!",
                    color: embedColors.green,
                    user: interaction.user,
                });

                return await interaction.Reply([ embed ]);
            }
        }
    }

    const embed = Embed({
        title: ":x: | Nie znaleziono wspóldzielenia!",
        color: embedColors.red,
        user: interaction.user,
    });

    return await interaction.Reply([ embed ]);
}

export const info: CommandInfoType = {
    name: "czywspoldzielone",
    description: "Sprawdź czy ktoś ma współdzieloną daną limitkę",
    permissions: PermissionFlagsBits.Administrator,
    role: [ Roles.Owner, Roles.Zarzad, Roles.HeadAdmin, Roles.Developer, Roles.TrialDeveloper ],
    builder: new SlashCommandBuilder()
        .addStringOption(option => option.setName("spawn-name").setDescription("Spawn name").setRequired(true))
        .setName("czywspoldzielone"),
};
