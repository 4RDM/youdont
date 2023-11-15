import { join } from "path";
import { existsSync } from "fs";
import { SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { Roles, embedColors } from "utils/constants";
import { Embed } from "utils/embedBuilder";

const path = join("/home/rdm/server/data/resources/[optymalizacja]/auta/stream");

export default async function ({ interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;

    if (!existsSync(path))
        return await interaction.Error("Funkcja niedostępna na tym komputerze!", { ephemeral: true });

    const respName = interaction.options.getString("resp-name", true);

    if (!existsSync(join(path, respName)))
        return await interaction.Reply([
            Embed({
                title: ":x: | Nie znaleziono pojazdu!",
                color: embedColors.red,
                user: interaction.user,
            }),
        ]);
    else
        return await interaction.Reply([
            Embed({
                title: ":white_check_mark: | Pojazd jest już na serwerze",
                color: embedColors.green,
                user: interaction.user,
            }),
        ]);
}

export const info: CommandInfoType = {
    name: "sprawdz",
    description: "Sprawdź czy auto jest dodane na serwer",
    role: [ Roles.Owner, Roles.Zarzad, Roles.HeadAdmin, Roles.Developer ],
    builder: new SlashCommandBuilder()
        .addStringOption(option => option.setName("resp-name").setDescription("Nazwa pojazdu").setRequired(true))
        .setName("sprawdz"),
};
