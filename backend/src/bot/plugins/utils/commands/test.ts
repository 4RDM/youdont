import { SlashCommandBuilder } from "discord.js";
import { Roles } from "../../../constants";

export default async function ({ interaction }: CommandArgs) {
	interaction.Reply("Permissions test passed!");
}

export const info: CommandInfo = {
	triggers: ["test"],
	description: "test",
	role: [Roles.Developer, Roles.Zarzad],
	builder: new SlashCommandBuilder().setName("test"),
};
