import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Embed, ErrorEmbedInteraction } from "utils/embedBuilder";
import { addFile } from "utils/filesystem";
import { hexToDec } from "utils/strings";
import { join } from "path";
import { existsSync } from "fs";
import { Roles } from "utils/constants";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import rcon from "utils/rcon";

const path = join("/home/rdm/server/data/permisje.cfg");

export default async function ({ interaction }: CommandArgs) {
    if (!existsSync(path))
        return interaction.Error("Funkcja niedostępna na tym komputerze!", { ephemeral: true });

    if (!interaction.isChatInputCommand()) return;

    const mention = interaction.options.getUser("mention", true);
    const hex = interaction.options.getString("hex", true);
    const role = interaction.options.getString("role", true);

    const interactionReply = await interaction.Reply([
        Embed({
            description: "**Wysyłanie**",
            user: interaction.user,
        }),
    ]);

    if (!interactionReply) return;

    addFile(`add_principal identifier.steam:${hex} group.${role} # ${mention.tag} (${mention.id}) https://steamcommunity.com/profiles/${hexToDec(hex)} ${new Date().toLocaleDateString()}`, path)
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

            rcon("exec permisje.cfg");
            rcon("refreshAllW0");
        })
        .catch(() => {
            interactionReply.edit({
                embeds: [ ErrorEmbedInteraction(interaction, "Nie udało się wysłać polecenia") ],
            });
        });
}

export const info: CommandInfoType = {
    name: "dodaj",
    description: "Dodaj użytkownika do konfiguracji",
    permissions: PermissionFlagsBits.Administrator,
    role: Roles.DodajTeam,
    builder: new SlashCommandBuilder()
        .addStringOption(option => option.setName("hex").setDescription("SteamID w hex").setRequired(true))
        .addStringOption(option => option.setName("role").setDescription("Ranga").setRequired(true))
        .addUserOption(option => option.setName("mention").setDescription("Użytkownik").setRequired(true))
        .setName("dodaj"),
};
