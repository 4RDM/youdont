import { SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";

export default async function ({ interaction }: CommandArgs) {

}

export const info: CommandInfoType = {
    name: "setup",
    description: "setup",
    builder: new SlashCommandBuilder()
};