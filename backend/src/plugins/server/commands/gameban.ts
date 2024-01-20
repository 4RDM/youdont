import {
    AutocompleteInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { Roles, embedColors } from "utils/constants";
import { Embed, ErrorEmbedInteraction } from "utils/embedBuilder";
import rcon from "utils/rcon";

export default async function ({ interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;

    const id = interaction.options.getInteger("id", true);
    const czas = interaction.options.getInteger("czas", true);
    const powod = interaction.options.getString("powod", true);

    if (isNaN(parseInt(<never>czas)))
        return await interaction.Error("Wprowadzony czas jest nieprawidłowy!", { ephemeral: true });

    const interactionReply = await interaction.Reply([
        Embed({
            description: "**Wysyłanie**",
            user: interaction.user,
        }),
    ]);

    if (!interactionReply) return;

    await rcon(`ban ${id.toString().replace(/[`;]/gm, "").split(";")[0].split(" ")[0]} ${czas.toString().replace(/[`;]/gm, "").split(";")[0].split(" ")[0]} ${powod.replace(/[`;]/gm, "").split(";")[0].split(" ")[0]}`)
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
                embeds: [
                    ErrorEmbedInteraction(interaction, "Nie udało się wysłać polecenia"),
                ],
            });
        });
}

export async function autocomplete(_: CommandArgs["client"], interaction: AutocompleteInteraction) {
    // if (!interaction.isAutocomplete()) return;

    await interaction.respond([
        { name: "6 godzin", value: 21600 },
        { name: "12 godzin", value: 43200 },
        { name: "1 dzień", value: 86400 },
        { name: "3 dni", value: 259200 },
        { name: "1 tydzień", value: 518400 },
        { name: "2 tydzień", value: 1123200 },
        { name: "1 miesiąc", value: 2678400 },
        { name: "1 rok", value: 31536000 },
        { name: "Permamenty", value: 0 },
    ]);
}

export const info: CommandInfoType = {
    name: "gameban",
    description: "Zbanuj osobę na serwerze",
    permissions: PermissionFlagsBits.Administrator,
    role: [ Roles.Team ],
    builder: new SlashCommandBuilder()
        .addIntegerOption(option => option.setName("id").setDescription("ID osoby do zbanowania").setRequired(true))
        .addIntegerOption(option => option.setName("czas").setDescription("Czas bana w sekundach").setRequired(true).setAutocomplete(true))
        .addStringOption(option => option.setName("powod").setMaxLength(100).setDescription("Powód bana").setRequired(true))
        .setName("gameban"),
};
