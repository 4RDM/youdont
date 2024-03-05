import { GuildMember, SlashCommandBuilder } from "discord.js";
import { createWriteStream } from "fs";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { join } from "path";
import { Readable } from "stream";
import { finished } from "stream/promises";
import { Embed } from "utils/embedBuilder";

export default async function ({ interaction }: CommandArgs) {
    const file = interaction.options.get("file", true);

    if (!file)
        return awaitinteraction.Error("Nie podano pliku", { ephemeral: true });

    if (!file.attachment)
        return await interaction.Error("Nie podano pliku", { ephemeral: true });

    const attachment = file.attachment;

    if (attachment.contentType !== "application/zip")
        return await interaction.Error("Plik musi być w formacie .zip", { ephemeral: true });

    // 100 MB
    if (attachment.size > 1024 * 1024 * 100)
        return await interaction.Error(`Plik jest za duży \`${Math.round(attachment.size / (1024 * 1024))}MB\` (max: \`100MB\`)`, { ephemeral: true });

    try {
        const stream = createWriteStream(join(__dirname, `../../../../temp/${attachment.name}_${Date.now()}.zip`));
        const { body } = await fetch(attachment.url);

        if (!body)
            return await interaction.Error("Wystąpił błąd podczas pobierania pliku", { ephemeral: true });

        // I don't want to mess with typescript here so I'm casting it to any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await finished(Readable.fromWeb(body as any).pipe(stream));

        stream.close();
    } catch(err) {
        return await interaction.Error("Wystąpił błąd podczas zapisywania pliku", { ephemeral: true });
    }

    return await interaction.Reply([
        Embed({
            title: "Pomyślnie wgrano plik",
            description: `Plik \`${attachment.name}\` został pomyślnie wgrany na serwer`,
            color: "#1F8B4C",
            user: interaction.user,
        })
    ]);
}

export const info: CommandInfoType = {
    name: "wgraj",
    description: "Wgraj samochód na serwer",
    builder: new SlashCommandBuilder()
        .addAttachmentOption(option => option.setName("file").setDescription("Plik .zip").setRequired(true))
        .setName("wgraj"),
};
