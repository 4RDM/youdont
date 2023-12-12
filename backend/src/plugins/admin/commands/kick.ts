import {
    GuildMember,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import { Roles } from "utils/constants";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { Embed } from "utils/embedBuilder";

export default async function ({ interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand() || !interaction.guild) return;

    const mention = interaction.options.getMember("mention") as GuildMember;
    const reason = interaction.options.getString("reason", false);

    if (!mention.kickable)
        return await interaction.Error("Nie udało się wyrzucić tego użytkownika!", { ephemeral: true });

    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (
        interaction.user.id !== "594526434526101527" &&
        interaction.user.id !== "364056796932997121" &&
        mention.roles.highest.position > member.roles.highest.position
    )
        return await interaction.Error("Użytkownik jest wyżej niż ty!", { ephemeral: true });

    if (
        (mention.id == "594526434526101527" && interaction.user.id !== "364056796932997121") ||
        (mention.id == "364056796932997121" && interaction.user.id !== "594526434526101527")
    ) return await interaction.Reply("🖕");

    await mention
        .kick(reason ? reason : "")
        .then(() => {
            interaction.Reply([
                Embed({
                    title: ":hammer: | Pomyślnie wyrzucono",
                    color: "#1F8B4C",
                    description: `Wyrzucony: \`${mention.user.tag}\` (\`${mention.id}\`)\nModerator: \`${interaction.user.tag}\` (\`${interaction.user.id}\`)\nPowód: \`${reason || "Brak"}\``,
                    user: interaction.user,
                }),
            ]);
        })
        .catch(() => {
            interaction.Error("Nie udało się wyrzucić tego użytkownika!", { ephemeral: true });
        });
}

export const info: CommandInfoType = {
    name: "kick",
    description: "Wyrzuć osobę",
    permissions: PermissionFlagsBits.KickMembers,
    role: [ Roles.Team ],
    builder: new SlashCommandBuilder()
        .addUserOption(option => option.setName("mention").setDescription("Użytkownik do wyrzucenia").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("Powód wyrzucenia").setRequired(false))
        .setName("kick"),
};
