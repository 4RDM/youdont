import { ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

const banIDRow = new ActionRowBuilder<ModalActionRowComponentBuilder>();
const banIDInput = new TextInputBuilder()
    .setLabel("ID Bana")
    .setCustomId("banID")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setPlaceholder("np. 612");

banIDRow.addComponents(banIDInput);

const reasonRow = new ActionRowBuilder<ModalActionRowComponentBuilder>();
const reasonInput = new TextInputBuilder()
    .setLabel("Powód")
    .setCustomId("reason")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMinLength(100)
    .setPlaceholder("min. 100 znaków");

reasonRow.addComponents(reasonInput);

export const unbanFormModal = new ModalBuilder()
    .setTitle("Odwołanie od bana")
    .setCustomId("unban_form")
    .addComponents(banIDRow, reasonRow);