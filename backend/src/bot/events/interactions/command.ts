import { CommandInteraction, GuildMemberRoleManager } from "discord.js";
import { Client } from "../../main";

// prettier-ignore
export const handleCommandInteraction = async(client: Client, interaction: CommandInteraction) => {
	if (!interaction.inGuild()) return;
	if (!interaction.isCommand()) return;

	const command = client.commandHandler.get(interaction.commandName);

	if (command) {
		if (command.info.permissions && command.info.role) {
			if (!interaction.memberPermissions.has(command.info.permissions) && !(interaction.member.roles as GuildMemberRoleManager).cache.has(command.info.role))
				return interaction.Reply({ content: "Nie posiadasz wymaganych uprawień do tego polecenia!", ephemeral: true });
		} else if (command.info.permissions) {
			if (!interaction.memberPermissions.has(command.info.permissions))
				return interaction.Reply({ content: "Nie posiadasz wymaganych uprawień do tego polecenia!", ephemeral: true });
		} else if (command.info.role) {
			if (!(interaction.member.roles as GuildMemberRoleManager).cache.has(command.info.role))
				return interaction.Reply({ content: "Nie posiadasz wymaganych uprawień do tego polecenia!", ephemeral: true });
		}
		command.execute({ client, interaction });
	}
};
