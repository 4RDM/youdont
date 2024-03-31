import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { embedColors } from "utils/constants";
import { Embed } from "utils/embedBuilder";

export default async function ({ interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand() || !interaction.channel || !interaction.channel.isTextBased() || !interaction.inGuild()) return;

    const amount = interaction.options.getInteger("amount", true);
    const messages = await interaction.channel.messages.fetch({ limit: amount });

    await interaction.channel.bulkDelete(messages).then(() =>
        interaction.Reply([
            Embed({
                color: embedColors.green,
                title: ":broom: Brooooom",
                description: `Usunięto **${amount}** wiadomości!`,
                user: interaction.user,
            }),
        ])
    ).catch(() => interaction.Error("Wystąpił błąd podczas usuwania wiadomości", { ephemeral: true }));
}

export const info: CommandInfoType = {
    name: "clear",
    description: "Usuwa określoną ilość wiadomości",
    permissions: PermissionFlagsBits.ManageMessages,
    builder: new SlashCommandBuilder()
        .addIntegerOption(option => option.setName("amount").setDescription("Ilość wiadomości do usunięcia").setRequired(true).setMinValue(1).setMaxValue(100))
        .setName("clear"),
};
