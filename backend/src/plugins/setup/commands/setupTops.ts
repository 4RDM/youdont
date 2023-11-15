import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";


export default async function ({ interaction }: CommandArgs) {
    interaction.channel?.send("TEST");
}

export const info: CommandInfoType = {
    name: "setuptops",
    description: "Setups tops message on this channel",
    permissions: PermissionFlagsBits.Administrator,
    builder: new SlashCommandBuilder().setName("setuptops")
};