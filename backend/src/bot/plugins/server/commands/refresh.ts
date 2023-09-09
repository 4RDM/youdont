import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";
import { Roles } from "../../../constants";

export default async function ({ client, interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;

    const interactionReply = await interaction.Reply({
        embeds: [
            Embed({
                description: "**Wysyłanie**",
                user: interaction.user,
            }),
        ],
    });

    if (!interactionReply) return;

    client.core.rcon("exec permisje.cfg")
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
    triggers: ["refresh"],
    description: "Przeładuj uprawnienia na serwerze",
    permissions: PermissionFlagsBits.Administrator,
    role: [Roles.Zarzad, Roles.HeadAdmin], // ZARZĄD
    builder: new SlashCommandBuilder().setName("refresh"),
};
