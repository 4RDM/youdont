import { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Embed } from "utils/discordEmbed";

export default async function ({ interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;

    const embed = Embed({
        title: ":x: | Odwołanie od bana",
        description: "Otwórz formularz odwołania od bana",
        color: "#f54242"
    });

    const row = new ActionRowBuilder<ButtonBuilder>();
    row.addComponents(new ButtonBuilder().setCustomId("open-unban-form").setLabel("Otwórz formularz").setStyle(ButtonStyle.Primary).setEmoji("📝"));

    if (!interaction.channel) return;

    return await interaction.channel.send({
        embeds: [embed],
        components: [row]
    });
}

export const info: CommandInfo = {
    triggers: ["unban_setup"],
    description: "",
    permissions: PermissionFlagsBits.Administrator,
    builder: new SlashCommandBuilder().setName("unban_setup"),
};
