import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { Roles, embedColors } from "utils/constants";
import { Embed } from "utils/embedBuilder";

export default async function ({ interaction }: CommandArgs) {
    interaction.Reply([
        Embed({
            description:
                "Pojazd, który wybrałeś jest już zajęty przez innego gracza 4RDM jako auto prywatne lub zostało dodane do menu partnera. **Wybierz inny pojazd!**",
            color: embedColors.red,
            user: interaction.user,
        }),
    ]);
}

export const info: CommandInfoType = {
    name: "zajete",
    description: "Wyślij wiadomość informującą o duplikacie pojazdu na serwerze",
    permissions: PermissionFlagsBits.Administrator,
    role: [ Roles.Owner, Roles.Zarzad, Roles.HeadAdmin, Roles.Developer ],
    builder: new SlashCommandBuilder().setName("zajete"),
};
