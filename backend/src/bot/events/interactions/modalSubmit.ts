import { ModalSubmitInteraction } from "discord.js";
import { Client } from "../../main";
import { accept } from "../../plugins/server/commands/zaakceptuj";

export const handleModalInteraction = async (client: Client, interaction: ModalSubmitInteraction) => {
    if (!interaction.isModalSubmit()) return;

    const [commandName, ...args] = interaction.customId.split("_");

    if (commandName == "donateAcceptModal") {
        accept(client, interaction, parseInt(args[0]), parseInt(interaction.fields.getTextInputValue("donateAcceptModalInput")));
    }
};
