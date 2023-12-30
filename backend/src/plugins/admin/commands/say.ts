import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { Roles, embedColors } from "utils/constants";
import { Embed } from "utils/embedBuilder";

export default async function ({ interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.inGuild()) return;

    const message = interaction.options.getString("wiadomosc", true);
    const embed = interaction.options.getBoolean("embed", false);

    if (embed) {
        await interaction.Reply([
            Embed({
                title: "Wiadomość od administracji",
                thumbnail: "https://4rdm.pl/assets/logo.png",
                description: message,
                user: interaction.user,
                color: embedColors.red,
            })
        ]);
    } else {
        await interaction.Reply(message);
    }

}

export const info: CommandInfoType = {
    name: "say",
    description: "Wyślij wiadomość",
    permissions: PermissionFlagsBits.Administrator,
    role: [ Roles.Owner, Roles.Zarzad ],
    builder: new SlashCommandBuilder()
        .addStringOption(option => option.setName("wiadomosc").setDescription("Wiadomość do wysłania").setRequired(true))
        .addBooleanOption(option => option.setName("embed").setDescription("Wysłać jako embed?").setRequired(false))
        .setName("say"),
};
