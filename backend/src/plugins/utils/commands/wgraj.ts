import { GuildMember, SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
// import { Embed } from "utils/embedBuilder";

export default async function ({ interaction }: CommandArgs) {
    const file = interaction.options.get("file", true);

    if (!file)
        return interaction.Error("Nie podano pliku", { ephemeral: true });

    if (!file.attachment)
        return interaction.Error("Nie podano pliku", { ephemeral: true });

    const attachment = file.attachment;

    console.log(attachment.contentType);

    interaction.Reply("Plik został przesłany");
}

export const info: CommandInfoType = {
    name: "wgraj",
    description: "Wgraj samochód na serwer",
    builder: new SlashCommandBuilder()
        .addAttachmentOption(option => option.setName("file").setDescription("Plik .zip").setRequired(true))
        .setName("wgraj"),
};
