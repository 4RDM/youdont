import { SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { join } from "path";
import { Readable, pipeline } from "stream";
import { createWriteStream, createReadStream } from "fs";
import { finished } from "stream/promises";
import zlib from "node:zlib";
import { embedColors } from "utils/constants";
import { Embed } from "utils/embedBuilder";
import logger from "utils/logger";

export default async function ({ interaction }: CommandArgs) {
    const file = interaction.options.get("file", true);

    await interaction.deferReply();

    if (!file)
        return await interaction.Error("Nie podano pliku");

    if (!file.attachment)
        return await interaction.Error("Nie podano pliku");

    const attachment = file.attachment;

    if (attachment.contentType !== "application/zip")
        return await interaction.Error("Plik musi być w formacie .zip");

    // 100 MB
    if (attachment.size > 1024 * 1024 * 100)
        return await interaction.Error(`Plik jest za duży \`${Math.round(attachment.size / (1024 * 1024))}MB\` (max: \`100MB\`)`);

    const generatedName = `${attachment.name}_${Date.now()}`; 

    try {
        const stream = createWriteStream(join(__dirname, `../../../../temp/${generatedName}.zip`), { flags: "w" });

        stream.on("open", async () => {
            const { body } = await fetch(attachment.url);

            if (!body)
                return await interaction.Error("Wystąpił błąd podczas pobierania pliku");
    
            // I don't want to mess with typescript here so I'm casting it to any
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await finished(Readable.fromWeb(body as any).pipe(stream));
            
            stream.close();

            try {
                const readStream = createReadStream(join(__dirname, `../../../../temp/${generatedName}.zip`));
                const writeStream = createWriteStream(join(__dirname, `../../../../temp/${generatedName}`));

                pipeline(readStream, zlib.createUnzip(), writeStream, function(err) {
                    if (err) logger.error(err);
                });
                
            } catch(err) {
                return await interaction.Error("Wystąpił błąd podczas odczytywania pliku");
            }

        });
    } catch(err) {
        return await interaction.Error("Wystąpił błąd podczas zapisywania pliku");
    }

    return await interaction.Reply([
        Embed({
            title: "Pomyślnie wgrano plik",
            description: `Plik \`${attachment.name}\` został pomyślnie wgrany na serwer`,
            color: embedColors.green,
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
