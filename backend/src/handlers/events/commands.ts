import { Interaction } from "discord.js";
import { RDMBot } from "main";
import logger from "utils/logger";

export default async function(client: RDMBot, interaction: Interaction) {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command)
        return await interaction.Error("Nie znaleziono polecenia!");

    try {
        await command.execute({ client, interaction });
    } catch(err) {
        logger.error(`events.commands(): ${err}`);
    }
}