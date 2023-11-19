import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { Roles, embedColors } from "utils/constants";
import { Embed, ErrorEmbedInteraction } from "utils/embedBuilder";
import rcon from "utils/rcon";

export default async function ({ interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;

    const id = interaction.options.getInteger("id", true);

    const interactionReply = await interaction.Reply([
        Embed({
            description: "**Wysyłanie**",
            user: interaction.user,
        }),
    ]);

    if (!interactionReply) return;

    await rcon(`unban ${id.toString().replace(/[`;]/gm, "").split(";")[0].split(" ")[0]}")}`)
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
        .catch(() => interactionReply.edit({ embeds: [ ErrorEmbedInteraction(interaction, "Nie udało się wysłać polecenia") ] }));
}

export const info: CommandInfoType = {
    name: "unban",
    description: "Odbanuj osobę na serwerze",
    permissions: PermissionFlagsBits.Administrator,
    role: [ Roles.Team ],
    builder: new SlashCommandBuilder()
        .addIntegerOption(option => option.setName("id").setDescription("ID bana do odbanowania").setRequired(true))
        .setName("unban"),
};
