import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import {
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { Embed } from "utils/embedBuilder";
import { embedColors } from "utils/constants";

const path = join("/home/rdm/server/data/resources/[4rdm]/4rdm/data/auta/antilag.json");

export default async function ({ interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;

    if (!existsSync(path))
        return await interaction.Error("Funkcja niedostępna na tym komputerze!", { ephemeral: true });

    let antilagJson = (await import(path)).default as string[];
    const subcommand = interaction.options.getSubcommand();
    const spawnName = interaction.options.getString("spawn-name", true);

    if (subcommand == "dodaj") {
        if (antilagJson.find(x => x == spawnName))
            return await interaction.Error("Samochód jest już dodany!", { ephemeral: true });

        antilagJson.push(spawnName);

        writeFileSync(path, JSON.stringify(antilagJson), { encoding: "utf-8" });

        const embed = Embed({
            title: ":white_check_mark: | Dodano antilaga!",
            color: embedColors.green,
            user: interaction.user,
        });

        return await interaction.Reply([ embed ]);
    } else if (subcommand == "usun") {
        if (!antilagJson.find(x => x == spawnName))
            return await interaction.Error("Samochód nie znajduje się na liście!", { ephemeral: true });

        antilagJson = antilagJson.filter(x => x != spawnName);

        writeFileSync(path, JSON.stringify(antilagJson), { encoding: "utf-8" });

        const embed = Embed({
            title: ":x: | Usunięto antilaga!",
            color: embedColors.red,
            user: interaction.user,
        });

        interaction.Reply([ embed ]);
    }
}

export const info: CommandInfoType = {
    name: "antilag",
    description: "Antilag do samochodu",
    permissions: PermissionFlagsBits.Administrator,
    builder: new SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName("dodaj")
                .setDescription("Dodaj antilaga")
                .addStringOption(option => option.setName("spawn-name").setDescription("Spawn name").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("usun")
                .setDescription("Usuń antilaga")
                .addStringOption(option => option.setName("spawn-name").setDescription("Spawn name").setRequired(true))
        )
        .setName("antilag"),
};
