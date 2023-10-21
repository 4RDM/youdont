import { Interaction } from "discord.js";
import { RDMBot } from "main";
import logger from "utils/logger";

export default async function(client: RDMBot, interaction: Interaction) {
    if (!interaction.isAutocomplete()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command)
        return;

    if (!command.autocomplete)
        return logger.warn(`Autocompletion for ${command.info.name} not found!`);

    try {
        await command.autocomplete({ client, interaction });
    } catch(err) {
        logger.error(`events.autocomplete(): ${err}`);
    }
}