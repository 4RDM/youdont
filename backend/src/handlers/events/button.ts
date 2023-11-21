import { Interaction } from "discord.js";
import { RDMBot } from "main";
import { acceptUnbanModal, denyUnbanModal, shortenBanModal, unbanFormModal } from "modals/unban";
import { doesUserHaveAnyRole } from "./commands";
import { Roles } from "utils/constants";

export default async function(_: RDMBot, interaction: Interaction) {
    if (!interaction.isButton()) return;

    const args = interaction.customId.split("-");

    switch(args[0]) {
        case "unbanFormModal":
            interaction.showModal(unbanFormModal);
            break;
        case "acceptUnbanModal":
            if (!interaction.member) return;

            if (!doesUserHaveAnyRole(interaction.member.roles, [ Roles.Team ]))
                return interaction.Error("Nie masz uprawnień do wykonania tej akcji!", { ephemeral: true });
            interaction.showModal(acceptUnbanModal.setCustomId(`accept_unban-${args[1]}`));

            break;
        case "denyUnbanModal":
            if (!interaction.member) return;

            if (!doesUserHaveAnyRole(interaction.member.roles, [ Roles.Team ]))
                return interaction.Error("Nie masz uprawnień do wykonania tej akcji!", { ephemeral: true });
            interaction.showModal(denyUnbanModal.setCustomId(`deny_unban-${args[1]}`));

            break;
        case "shortenBanForm":
            if (!interaction.member) return;

            if (!doesUserHaveAnyRole(interaction.member.roles, [ Roles.Team ]))
                return interaction.Error("Nie masz uprawnień do wykonania tej akcji!", { ephemeral: true });
            interaction.showModal(shortenBanModal.setCustomId(`shorten_ban-${args[1]}`));

            break;
    }
}