import { ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

/*
    UNBAN FORM
*/

const banIDRow = new ActionRowBuilder<ModalActionRowComponentBuilder>();
const banIDInput = new TextInputBuilder()
    .setLabel("ID Bana")
    .setCustomId("banID")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(5)
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

/*
    ACCEPT UNBAN FORM
*/

const commentRow = new ActionRowBuilder<ModalActionRowComponentBuilder>();
const commentInput = new TextInputBuilder()
    .setLabel("Krótki komentarz")
    .setCustomId("comment")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setPlaceholder("...");

commentRow.addComponents(commentInput);

export const acceptUnbanModal = new ModalBuilder()
    .setTitle("Zaakceptuj podanie o unbana")
    .setCustomId("accept_unban")
    .addComponents(commentRow);

/*
    DENY UNBAN FORM
*/

export const denyUnbanModal = new ModalBuilder()
    .setTitle("Odrzuć podanie o unbana")
    .setCustomId("deny_unban")
    .addComponents(commentRow);

/*
    SHORTEN UNBAN FORM
*/

const secondsRow = new ActionRowBuilder<ModalActionRowComponentBuilder>();
const secondsInput = new TextInputBuilder()
    .setLabel("Ilość sekund")
    .setCustomId("seconds")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setPlaceholder("O ile sekund skrócić bana?");

secondsRow.addComponents(secondsInput);

export const shortenUnbanModal = new ModalBuilder()
    .setTitle("Skróć bana")
    .setCustomId("shorten_unban")
    .addComponents(commentRow, secondsRow);