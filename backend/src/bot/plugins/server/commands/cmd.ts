import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";

export default async function ({ client, interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.options.getString("command", true);

    const interactionReply = await interaction.Reply({
        embeds: [
            Embed({
                description: "**Wysyłanie**",
                user: interaction.user,
            }),
        ],
    });

    if (!interactionReply) return;

    client.core.rcon(command)
        .then(() => {
            interactionReply.edit({
                embeds: [
                    Embed({
                        color: "#1F8B4C",
                        description: "**Wysłano!**",
                        user: interaction.user,
                    }),
                ],
            });
        })
        .catch(() => {
            interactionReply.edit({
                embeds: [ErrorEmbedInteraction(interaction, "Nie udało się wysłać polecenia")],
            });
        });
}

export const info: CommandInfo = {
    triggers: ["cmd", "command"],
    description: "Wyślij polecenie do konsoli",
    permissions: PermissionFlagsBits.Administrator,
    builder: new SlashCommandBuilder()
        .addStringOption(option => option.setName("command").setDescription("Polecenie do wykonania").setRequired(true))
        .setName("cmd"),
};
