import {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";

export const modal = (...args: string[]) =>
    new ModalBuilder()
        .setCustomId(`unban_form_${args[0]}`)
        .setTitle("Formularz unbana")
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId("banID")
                    .setLabel("ID bana")
                    .setPlaceholder("np. 1298")
                    .setMinLength(1)
                    .setStyle(TextInputStyle.Short),
                new TextInputBuilder()
                    .setCustomId("description")
                    .setLabel("Dlaczego masz dostać unbana?")
                    .setStyle(TextInputStyle.Paragraph)
            )
        );

export const info = {
    name: "unbanFormModal",
};
