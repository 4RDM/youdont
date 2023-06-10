import {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";

export const modal = (...args: string[]) =>
	new ModalBuilder()
		.setCustomId(`donateAcceptModal_${args[0]}`)
		.setTitle("Podaj kwotę wpłaty!")
		.addComponents(
			new ActionRowBuilder<TextInputBuilder>().addComponents(
				new TextInputBuilder()
					.setCustomId("donateAcceptModalInput")
					.setLabel("Kwota wpłaty")
					.setPlaceholder("w złotówkach")
					.setMinLength(1)
					.setMaxLength(4)
					.setStyle(TextInputStyle.Short)
			)
		);

export const info = {
	name: "donateAcceptModal",
};
