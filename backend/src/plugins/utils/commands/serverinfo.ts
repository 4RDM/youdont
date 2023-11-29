import { SlashCommandBuilder } from "discord.js";
import { Embed } from "utils/embedBuilder";
import { CommandArgs, CommandInfoType } from "handlers/commands";

export default async function ({ interaction }: CommandArgs) {
    const embed = Embed({
        title: interaction.guild?.name,
        fields: [
            {
                name: ":manual_wheelchair: Użytkownicy",
                value: `\`${interaction.guild?.memberCount.toString()}\`` || "`0`",
                inline: true,
            },
            {
                name: ":chains: Vanity URL",
                value: `\`${interaction.guild?.vanityURLCode}\``,
                inline: true,
            },
            {
                name: ":name_badge: Bany",
                value: `\`${(await interaction.guild?.bans.fetch())?.size.toString()}\`` || "`0`",
                inline: true,
            },
            {
                name: ":moyai: Ilość kanałów",
                value: `\`${interaction.guild?.channels.cache.size.toString()}\`` || "`0`",
                inline: true,
            },
            {
                name: ":moyai: Ilość ról",
                value: `\`${interaction.guild?.roles.cache.size.toString()}\`` || "`0`",
                inline: true,
            },
            {
                name: ":clock10: Data utworzenia",
                value: `<t:${Math.floor((interaction.guild?.createdAt.getTime() || Date.now()) / 1000)}:R>`,
                inline: true,
            },
        ],
        thumbnail: interaction.guild?.iconURL({ forceStatic: false }) || "",
        user: interaction.user,
    });
    interaction.Reply([ embed ]);
}

export const info: CommandInfoType = {
    name: "serverinfo",
    description: "Sprawdź informacje o serwerze",
    builder: new SlashCommandBuilder().setName("serverinfo"),
};
