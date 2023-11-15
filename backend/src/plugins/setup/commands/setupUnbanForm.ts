import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { Embed } from "utils/embedBuilder";

export default async function ({ client, interaction }: CommandArgs) {
    const adminChannel = interaction.options.get("adminchannel", true).channel;

    if (!adminChannel)
        return await interaction.Error("Nie udało się odnaleźć kanału, skontaktuj się z administracją!", { ephemeral: true });

    const res = await client.database.config.set("unbanFormAdminChannel", adminChannel.id);

    if (res === -1)
        return await interaction.Error("Długość klucza jest nieprawidłowa, skontaktuj się z administracją!", { ephemeral: true });

    if (res === false)
        return await interaction.Error("Wystąpił błąd bazy danych, skontaktuj się z administracją!", { ephemeral: true });

    const actionRow = new ActionRowBuilder<ButtonBuilder>();
    actionRow.addComponents(new ButtonBuilder().setCustomId("unbanFormModal").setLabel("Otwórz formularz").setStyle(ButtonStyle.Success));

    return await interaction.Reply([ Embed({ title: "Odwołanie od bana", description: "Aby otworzyć formularz naciśnij przycisk poniżej" }) ], { components: [ actionRow ] });
}

export const info: CommandInfoType = {
    name: "unbanform",
    description: "Setups unban form on this channel",
    permissions: PermissionFlagsBits.Administrator,
    builder: new SlashCommandBuilder()
        .addChannelOption(option =>
            option.setName("adminchannel")
                .setDescription("Where to send unban requests")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        )
        .setName("unbanform")
};