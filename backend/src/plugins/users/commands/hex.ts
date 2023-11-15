import { SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { RDMBot } from "main";
import logger from "utils/logger";

export const getUserHex = async function (client: RDMBot, discordId: string) {
    try {
        const response = await client.database.players.getUserFromServer(discordId);

        return response;
    } catch (err) {
        logger.error(`MariaDB returned an error: ${err}`);

        return false;
    }
};

export default async function ({ client, interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;

    const mention = interaction.options.getUser("mention", true);
    const response = await getUserHex(client, mention.id);

    if (!response)
        return interaction.Error("Nie znaleziono użytkownika w bazie danych", { ephemeral: true });

    const identifiers = response.map(x => x?.identifier);

    if (identifiers.length == 0)
        return interaction.Error("Nie znaleziono użytkownika w bazie danych", { ephemeral: true });

    return interaction.Reply(`\`\`\`Znalezione identyfikatory:\n${identifiers.join("\n")}\`\`\``);
}

export const info: CommandInfoType = {
    name: "hex",
    description: "Sprawdź hex użytkownika",
    builder: new SlashCommandBuilder()
        .addUserOption(option => option.setName("mention").setDescription("Użytkownik, którego hex chcesz sprawdzić").setRequired(true))
        .setName("hex"),
};
