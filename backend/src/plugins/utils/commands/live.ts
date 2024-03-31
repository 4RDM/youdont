import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Embed } from "utils/embedBuilder";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import logger from "utils/logger";
import { Roles, embedColors } from "utils/constants";

export default async function ({ client, interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;

    const member = interaction.options.getMember("mention") as GuildMember | null;

    if (!member) return await interaction.Error("Nie znaleziono użytkownika!", { ephemeral: true });

    if (!member.voice.channel) return await interaction.Error("Użytkownik nie jest na kanale głosowym!", { ephemeral: true });

    client.liveCache.set(member.id, 1);

    await member.voice.channel.permissionOverwrites.create(member.id, {
        ViewChannel: true,
        Connect: true,
        Stream: true,
    }, { reason: "User joined channel" }).catch(res => logger.error(`EventHandler(): Error while editing channel permissions: ${res}`));

    await interaction.Reply([ Embed({
        color: embedColors.green,
        title: ":white_check_mark: | Nadano uprawnienia do live",
        description: `Nadano uprawnienia do live użytkownikowi \`${member.user.tag}\` (\`${member.id}\`)`,
        user: interaction.user,
    }) ]);
}

export const info: CommandInfoType = {
    name: "live",
    description: "Nadaj uprawnienia do streamowania na kanale",
    role: Roles.HoundsTeam,
    permissions: PermissionFlagsBits.Administrator,
    builder: new SlashCommandBuilder()
        .addUserOption(option => option.setName("mention").setDescription("Użytkownik, któremu nadać uprawnienia do live").setRequired(true))
        .setName("live"),
};
