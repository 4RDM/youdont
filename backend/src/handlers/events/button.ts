import { Interaction } from "discord.js";
import { RDMBot } from "main";
import { unbanFormModal } from "modals/unban";

export default async function(client: RDMBot, interaction: Interaction) {
    if (!interaction.isButton()) return;

    if (interaction.customId == "test1")
        interaction.showModal(unbanFormModal);
}