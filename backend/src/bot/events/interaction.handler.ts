import {
	ActionRowBuilder,
	GuildMemberRoleManager,
	Interaction,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { odrzuc } from "../plugins/server/commands/odrzuc";
import { accept } from "../plugins/server/commands/zaakceptuj";

// prettier-ignore
export default async function ({
	client,
	props,
}: {
	client: ClientType;
	props: { "0": Interaction };
}) {
	const interaction = props["0"];

	if (!interaction.inGuild()) return;

	if (interaction.isCommand()) {
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
	} else if (interaction.isButton()) {
		const [commandName, ...args] = interaction.customId.split("_");

		if (commandName == "donateAccept") {
			const modal = new ModalBuilder()
				.setCustomId(`donateAcceptModal_${args[0]}`)
				.setTitle("Podaj kwotę wpłaty!")
				.addComponents(
					new ActionRowBuilder<TextInputBuilder>()
						.addComponents(
							new TextInputBuilder()
								.setCustomId("donateAcceptModalInput")
								.setLabel("Kwota wpłaty")
								.setPlaceholder("w złotówkach")
								.setMinLength(1)
								.setMaxLength(4)
								.setStyle(TextInputStyle.Short)
						)
				);
			await interaction.showModal(modal);
		} else if (commandName == "donateReject") {
			odrzuc(client, interaction, parseInt(args[0]));
		}
	} else if (interaction.isModalSubmit()) {
		const [commandName, ...args] = interaction.customId.split("_");

		if (commandName == "donateAcceptModal") {
			accept(client, interaction, parseInt(args[0]), parseInt(interaction.fields.getTextInputValue("donateAcceptModalInput")));
		}
	}
}

export const info: EventInfo = {
	eventName: "interactionCreate",
};
