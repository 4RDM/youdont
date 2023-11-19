import { SlashCommandBuilder } from "discord.js";
import { Roles } from "utils/constants";
import { CommandArgs, CommandInfoType } from "handlers/commands";

export default async function ({ interaction }: CommandArgs) {
    interaction.Reply("Permissions test passed!");
}

export const info: CommandInfoType = {
    name: "test",
    description: "test",
    role: [ Roles.Developer, Roles.Zarzad ],
    builder: new SlashCommandBuilder().setName("test"),
};
