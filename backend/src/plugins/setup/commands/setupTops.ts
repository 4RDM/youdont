import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";

export default async function ({ interaction, client }: CommandArgs) {
    if (!interaction.isChatInputCommand() || !interaction.channel || !interaction.channel.isTextBased() || !interaction.inGuild()) return;

    const message = await interaction.channel.send("TOPS SETUP");

    if (!message) return interaction.Error("Wystąpił błąd podczas tworzenia wiadomości", { ephemeral: true });

    let res = await client.database.config.set("statsChannelID", interaction.channel.id);

    if (res === -1)
        return await interaction.Error("Długość klucza jest nieprawidłowa, skontaktuj się z administracją!", { ephemeral: true });

    if (res === false)
        return await interaction.Error("Wystąpił błąd bazy danych, skontaktuj się z administracją!", { ephemeral: true });

    res = await client.database.config.set("statsMessageID", message.id);

    if (res === -1)
        return await interaction.Error("Długość klucza jest nieprawidłowa, skontaktuj się z administracją!", { ephemeral: true });

    if (res === false)
        return await interaction.Error("Wystąpił błąd bazy danych, skontaktuj się z administracją!", { ephemeral: true });

    return await interaction.Reply("Ustawiono wiadomość statystyk na ten kanał!", { ephemeral: true });
}

export const info: CommandInfoType = {
    name: "setuptops",
    description: "Setups tops message on this channel",
    permissions: PermissionFlagsBits.Administrator,
    builder: new SlashCommandBuilder().setName("setuptops")
};