import { GuildMember, SlashCommandBuilder } from "discord.js";
import { Embed } from "../../../../utils/discordEmbed";

export default async function ({ interaction }: CommandArgs) {
    const user = interaction.options.getMember("mention") as GuildMember | null;

    if (!user) return;

    const embed = Embed({
        title: user.nickname || user.user.tag,
        fields: [
            {
                name: "Nazwa",
                value: `\`${user.user.tag}\``,
                inline: true,
            },
            {
                name: "Pseudonim",
                value: `\`${user.nickname ? user.nickname : "Brak"}\``,
                inline: true,
            },
            {
                name: "ID",
                value: `\`${user.id}\``,
                inline: true,
            },
            {
                name: "Dołączył",
                value: `<t:${Math.floor((user.joinedAt?.getTime() || 0) / 1000)}:R>`,
                inline: true,
            },
            {
                name: "Utworzył konto",
                value: `<t:${Math.floor((user.user.createdAt?.getTime() || 0) / 1000)}:R>`,
                inline: true,
            },
            {
                name: "Booster od",
                value: `${user.premiumSince ? `<t:${Math.floor((user.premiumSince.getTime() || 0) / 1000)}:R>` : "`Brak`"}`,
                inline: true,
            },
        ],
        image:
            user.user.bannerURL({
                forceStatic: false,
                size: 1024,
                extension: "png",
            }) || "",
        thumbnail: user.displayAvatarURL({ forceStatic: false }),
        user: interaction.user,
    });

    interaction.Reply({ embeds: [embed] });
}

export const info: CommandInfo = {
    triggers: ["userinfo", "user"],
    description: "Sprawdź informacje na temat użytkownika",
    builder: new SlashCommandBuilder()
        .addUserOption(option => option.setName("mention").setDescription("Użytkownik").setRequired(true))
        .setName("userinfo"),
};
