import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { Embed } from "utils/embedBuilder";

export default async function ({ interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand() || !interaction.guild) return;

    const mention = interaction.options.getMember("mention") as GuildMember | null;
    const reason = interaction.options.getString("reason", false);

    if (!mention)
        return await interaction.Error("Nie znaleziono użytkownika!", { ephemeral: true });

    if (!mention.bannable)
        return await interaction.Error("Nie udało się zbanować tego użytkownika!", { ephemeral: true });

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
        .ban({ reason: reason ? reason : "", deleteMessageSeconds: 12 * 60 * 60 })
        .then(user =>
            interaction.Reply([
                Embed({
                    title: ":hammer: Banhammer",
                    color: "#1F8B4C",
                    description: `Zbanowany: \`${typeof user !== "string" ? user.id : user}\` (\`${mention.id}\`)\nModerator: \`${interaction.user.tag}\` (\`${interaction.user.id}\`)\nPowód: \`${reason || "Brak"}\``,
                    user: interaction.user,
                }),
            ])
        )
        .catch(() => interaction.Error("Nie udało się zbanować tego użytkownika!", { ephemeral: true }));
}

export const info: CommandInfoType = {
    name: "ban",
    description: "Zbanuj osobę",
    permissions: PermissionFlagsBits.BanMembers,
    role: [ Roles.Team ],
    builder: new SlashCommandBuilder()
        .addUserOption(option => option.setName("mention").setDescription("Użytkownik do zbanowania").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("Powód zbanowania").setRequired(false))
        .setName("ban"),
};
