import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { Roles, embedColors } from "utils/constants";
import { Embed, ErrorEmbedInteraction } from "utils/embedBuilder";
import rcon from "utils/rcon";

export default async function ({ interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;

    const interactionReply = await interaction.Reply([
        Embed({
            description: "**Wysyłanie**",
            user: interaction.user,
        }),
    ]);

    if (!interactionReply) return;

    rcon("exec permisje.cfg;refreshallw0")
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
    name: "refresh",
    description: "Przeładuj uprawnienia na serwerze",
    permissions: PermissionFlagsBits.Administrator,
    role: [ Roles.Zarzad, Roles.HeadAdmin, Roles.Developer ],
    builder: new SlashCommandBuilder().setName("refresh"),
};
