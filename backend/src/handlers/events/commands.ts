import { GuildMemberRoleManager, Interaction } from "discord.js";
import { RDMBot } from "main";
import logger from "utils/logger";

export const doesUserHaveAnyRole = (userPermissions: GuildMemberRoleManager | string[], roles: string[]) => {
    if (userPermissions instanceof GuildMemberRoleManager) {
        return roles.find(roleToFind => userPermissions.cache.find((role) => role.id == roleToFind)) ? true : false;
    }
    return roles.find(roleToFind => userPermissions.find(role => role == roleToFind)) ? true : false;
};

export default async function(client: RDMBot, interaction: Interaction) {
    if (!interaction.inGuild()) return;
    if (!interaction.isCommand()) return;

    await interaction.deferReply(); // Some commands may take a while to execute, this will let the user know that the bot is processing the command

    const command = client.commands.get(interaction.commandName);

    if (!command)
        return await interaction.Error("Nie znaleziono polecenia, skontaktuj się z administracją", { ephemeral: true });

    if (command.info.permissions) {
        if (command.info.role) {
            if (!interaction.memberPermissions.has(command.info.permissions) && !doesUserHaveAnyRole(interaction.member.roles, command.info.role))
                return interaction.Error("Nie posiadasz wymaganych uprawień do tego polecenia!", { ephemeral: true });
        } else if (!interaction.memberPermissions.has(command.info.permissions))
            return interaction.Error("Nie posiadasz wymaganych uprawień do tego polecenia!", { ephemeral: true });
    } else if (command.info.role) {
        if (!doesUserHaveAnyRole(interaction.member.roles, command.info.role))
            return interaction.Error("Nie posiadasz wymaganych uprawień do tego polecenia!", { ephemeral: true });
    }

    try {
        await command.execute({ client, interaction });
    } catch(err) {
        logger.error(`events.commands(): ${err}`);
    }
}