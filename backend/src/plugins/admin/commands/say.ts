import { randomUUID } from "crypto";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { Roles } from "utils/constants";

export default async function ({ client, interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.inGuild()) return;

    const message = interaction.options.getString("wiadomosc", true);
    const embed = interaction.options.getBoolean("embed", false);

    if (embed) {
        const uuid = randomUUID();

        client.embedCache.set(uuid, { channelID: interaction.channelId, content: message, time: Date.now() });
        
        await interaction.Reply(`https://4rdm.pl/embeds/${uuid}`, {
            ephemeral: true,
        });
    } else {
        await interaction.Reply(message);
    }
}

export const info: CommandInfoType = {
    name: "say",
    description: "Wyślij wiadomość",
    permissions: PermissionFlagsBits.Administrator,
    role: [ Roles.Owner, Roles.Zarzad ],
    builder: new SlashCommandBuilder()
        .addStringOption(option => option.setName("wiadomosc").setDescription("Wiadomość do wysłania").setRequired(true))
        .addBooleanOption(option => option.setName("embed").setDescription("Wysłać jako embed?").setRequired(false))
        .setName("say"),
};
