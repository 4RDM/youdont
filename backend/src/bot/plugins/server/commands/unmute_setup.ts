import { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Embed } from "utils/discordEmbed";

export default async function ({ interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;

    const embed = Embed({
        title: ":mute: | Odwołanie od mute",
        description: "Otwórz formularz odwołania od mute",
        color: "#f54242"
    });

    const row = new ActionRowBuilder<ButtonBuilder>();
    row.addComponents(new ButtonBuilder().setCustomId("open-mute-form").setLabel("Otwórz formularz").setStyle(ButtonStyle.Primary).setEmoji("📝"));

    if (!interaction.channel) return;

    return await interaction.channel.send({
        embeds: [embed],
        components: [row]
    });
}

export const info: CommandInfo = {
    triggers: ["unmute_setup"],
    description: "Setup unmute modal",
    permissions: PermissionFlagsBits.Administrator,
    builder: new SlashCommandBuilder().setName("unmute_setup"),
};
