import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { embedColors } from "utils/constants";
import { Embed, ErrorEmbedInteraction } from "utils/embedBuilder";
import rcon from "utils/rcon";

export default async function ({ interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.options.getString("command", true);

    const interactionReply = await interaction.Reply([
        Embed({
            description: "**Wysyłanie**",
            user: interaction.user,
        }),
    ]);

    if (!interactionReply) return;

    rcon(command)
        .then(() => {
            interactionReply.edit({
                embeds: [
                    Embed({
                        color: embedColors.green,
                        description: "**Wysłano!**",
                        user: interaction.user,
                    }),
                ],
            });
        })
        .catch(() => {
            interactionReply.edit({
                embeds: [ ErrorEmbedInteraction(interaction, "Nie udało się wysłać polecenia") ],
            });
        });
}

export const info: CommandInfoType = {
    name: "cmd",
    description: "Wyślij polecenie do konsoli",
    permissions: PermissionFlagsBits.Administrator,
    builder: new SlashCommandBuilder()
        .addStringOption(option => option.setName("command").setDescription("Polecenie do wykonania").setRequired(true))
        .setName("cmd"),
};
