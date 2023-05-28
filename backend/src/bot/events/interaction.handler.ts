import { GuildMemberRoleManager, Interaction } from "discord.js";

// prettier-ignore
export default async function ({
	client,
	props,
}: {
	client: ClientType;
	props: { "0": Interaction };
}) {
	const interaction = props["0"];

	if (!interaction.isCommand() || !interaction.inGuild()) return;

	const command = client.CommandHandler.get(interaction.commandName);

	if (command) {
		if ((command.info.role && (interaction.member.roles as GuildMemberRoleManager).cache.has(command.info.role)) || interaction.memberPermissions.has(command.info.permissions || []))
			command.execute({ client, interaction });
		else
			return interaction.reply({
				content: "Nie posiadasz wymaganych uprawień do tego polecenia!",
				ephemeral: true,
			});
	}
}

export const info: EventInfo = {
	eventName: "interactionCreate",
};
