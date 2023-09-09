import { SlashCommandBuilder } from "discord.js";

export default async function ({ interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;
}

export const info: CommandInfo = {
    triggers: ["dodajsamochod"],
    description: "Dodaje samochód na serwer",
    builder: new SlashCommandBuilder()
        .addAttachmentOption(option => option.setName("zip").setDescription("Plik .zip zawierający pliki samochodu").setRequired(true))
        .setName("dodajsamochod"),
};
