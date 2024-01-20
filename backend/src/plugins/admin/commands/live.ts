import { SlashCommandBuilder } from "discord.js";
import { Roles as Rl } from "utils/constants";
import { CommandArgs, CommandInfoType } from "handlers/commands";

export default async function ({ interaction }: CommandArgs) {
    
}
export const info: CommandInfoType = {
    name: "live",
    description: "Zmienia status ticketa",
    role: [ Rl.Team ],
    builder: new SlashCommandBuilder()
        .addUserOption(option => option.setName("mention").setDescription("Użytkownik").setRequired(true))
        .setName("live"),
};
