import { Interaction } from "discord.js";
import { RDMBot } from "main";
import logger from "utils/logger";

export default async function(client: RDMBot, interaction: Interaction) {
    if (!interaction.isModalSubmit()) return;

    const args = interaction.customId.split("-");
    const modal = client.modals.get(args[0]);

    if (!modal)
        return interaction.Error("Nie znaleziono modala, skontaktuj się z administracją!", { ephemeral: true });

    try {
        await modal.execute({ client, interaction, args });
    } catch(err) {
        logger.error(`events.modals(): ${err}`);
    }
}