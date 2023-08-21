import { Client } from "../../main";
import { AutocompleteInteraction, GuildMemberRoleManager } from "discord.js";
import { doesUserHaveAnyRole } from "./command";

// prettier-ignore
export const handleAutocompleteInteraction = async (
	client: Client,
	interaction: AutocompleteInteraction
) => {
	const command = client.commandHandler.get(interaction.commandName);

	if (!command) return client.logger.error(`AUTOCOMPLETE Could not find the command ${interaction.commandName}`);

	if (!interaction.inGuild() || interaction.user.bot) return;
	if (!((command.info.role && doesUserHaveAnyRole(interaction.member.roles, command.info.role)) || (interaction.memberPermissions.has(command.info.permissions || [])))) return;

	try {
		if (!command.autocomplete) throw new Error(`AUTOCOMPLETE The command ${interaction.commandName} does not have an autocomplete function`);

		await command.autocomplete(client, interaction);
	} catch (error) {
		console.error(error);
	}
};
