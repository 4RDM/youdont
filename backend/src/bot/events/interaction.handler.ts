import { GuildMemberRoleManager, Interaction } from "discord.js";

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

	// prettier-ignore
	if (command) {
		if ((command.info.role && (interaction.member.roles as GuildMemberRoleManager).cache.has(command.info.role)) || interaction.memberPermissions.has(command.info.permissions || []))
			command.execute({ client, interaction });
		else
			return interaction.reply({
				content: "Nie posiadasz wymaganych uprawień do tego polecenia!",
				ephemeral: true,
			});
	}

	// const command = client.CommandHandler.get(interaction.commandName);

	// if (command) {
	// 	command.execute({ client, interaction });
	// }
}

export const info: EventInfo = {
	eventName: "interactionCreate",
};
