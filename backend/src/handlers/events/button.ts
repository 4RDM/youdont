import { Interaction } from "discord.js";
import { RDMBot } from "main";
import { acceptUnbanModal, denyUnbanModal, unbanFormModal } from "modals/unban";

export default async function(client: RDMBot, interaction: Interaction) {
    if (!interaction.isButton()) return;

    const args = interaction.customId.split("-");

    switch(args[0]) {
        case "unbanFormModal":
            interaction.showModal(unbanFormModal);
            break;
        case "acceptUnbanModal":
            interaction.showModal(acceptUnbanModal.setCustomId(`accept_unban-${args[1]}`));
            break;
        case "denyUnbanModal":
            interaction.showModal(denyUnbanModal.setCustomId(`deny_unban-${args[1]}`));
            break;
        case "shortenUnbanForm":
            /* TODO */
            break;
    }
}