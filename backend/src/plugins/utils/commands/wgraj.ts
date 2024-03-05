import { GuildMember, SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
// import { Embed } from "utils/embedBuilder";

export default async function ({ interaction }: CommandArgs) {
    interaction;
    // template for upload command
}

export const info: CommandInfoType = {
    name: "wgraj",
    description: "Wgraj samochód na serwer",
    builder: new SlashCommandBuilder()
        .addAttachmentOption(option => option.setName("file").setDescription("Plik .zip").setRequired(true))
        .setName("wgraj"),
};
