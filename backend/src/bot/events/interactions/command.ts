import { CommandInteraction, GuildMemberRoleManager } from "discord.js";
import { Client } from "../../main";

// prettier-ignore
export const handleCommandInteraction = async(client: Client, interaction: CommandInteraction) => {
	if (!interaction.inGuild()) return;
	if (!interaction.isCommand()) return;

	const command = client.commandHandler.get(interaction.commandName);

	if (command) {
		if ((command.info.role && (interaction.member.roles as GuildMemberRoleManager).cache.has(command.info.role)) || (interaction.memberPermissions.has(command.info.permissions || [])))
			command.execute({ client, interaction });
		else
			return interaction.Reply({ content: "Nie posiadasz wymaganych uprawień do tego polecenia!", ephemeral: true });
	}
};
