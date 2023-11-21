import { Interaction } from "discord.js";
import { RDMBot } from "main";
import logger from "utils/logger";
import { doesUserHaveAnyRole } from "./commands";

export default async function(client: RDMBot, interaction: Interaction) {
    if (!interaction.isModalSubmit()) return;

    const args = interaction.customId.split("-");
    const modal = client.modals.get(args[0]);

    if (!modal)
        return await interaction.Error("Nie znaleziono modala, skontaktuj się z administracją!", { ephemeral: true });

    try {
        if (!interaction.member) return;

        if (!doesUserHaveAnyRole(interaction.member.roles, modal.info.roles))
            return interaction.Error("Nie masz uprawnień do wykonania tej akcji!", { ephemeral: true });

        await modal.execute({ client, interaction, args });
    } catch(err) {
        logger.error(`events.modals(): ${err}`);
    }
}