import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { Roles, embedColors } from "utils/constants";
import { Embed, ErrorEmbedInteraction } from "utils/embedBuilder";
import rcon from "utils/rcon";

export default async function ({ interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;

    const muteid = interaction.options.getInteger("muteid", true);
    const playerid = interaction.options.getInteger("playerid", false);
    
    const interactionReply = await interaction.Reply([
        Embed({
            description: "**Wysyłanie**",
            user: interaction.user,
        }),
    ]);

    if (!interactionReply) return;
    let command = `unmuteoffline ${muteid.toString().replace(/[`;]/gm, "").split(";")[0]}`;
    console.log(playerid);
    if (playerid) {
        command = `unmute ${muteid.toString().replace(/[`;]/gm, "").split(";")[0]} ${playerid.toString().replace(/[`;]/gm, "").split(";")[0]}`;
    }
    await rcon(command)
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
    name: "unmute",
    description: "Odbanuj osobę na serwerze",
    permissions: PermissionFlagsBits.Administrator,
    role: [ Roles.Team ],
    builder: new SlashCommandBuilder()
        .addIntegerOption(option => option.setName("muteid").setDescription("ID mute do odmutowania").setRequired(true))
        .addIntegerOption(option => option.setName("playerid").setDescription("ID osoby do odmutowania").setRequired(false))
        .setName("unban"),
};
