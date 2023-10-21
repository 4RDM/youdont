import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { Embed } from "utils/embedBuilder";

export default async function ({ interaction }: CommandArgs) {
    const actionRow = new ActionRowBuilder<ButtonBuilder>();
    actionRow.addComponents(new ButtonBuilder().setCustomId("test1").setLabel("Test").setStyle(ButtonStyle.Success));

    return interaction.Reply([ Embed({ title: "test" }) ], { components: [actionRow] });
}

export const info: CommandInfoType = {
    name: "test",
    description: "test",
    builder: new SlashCommandBuilder()
};