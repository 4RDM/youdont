import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { ModalSubmitArgs, ModalSubmitInfoType } from "handlers/modals";
import { join } from "path";
import { Roles } from "utils/constants";
import { Embed } from "utils/embedBuilder";


const path =
    process.env.NODE_ENV == "production" ?
        "/home/rdm/server/data/resources/[4rdm]/EasyAdmin-6/banlist.json" :
        join(__dirname, "..", "..", "..", "banlist.json");

export interface Ban {
    expire: number
    identifiers: string[]
    banner: string
    bannersteam: string
    banid: number
    expireString: string
    name: string
    reason: string
}

export const getBan = async(banID: string) => {
    const file = await readFile(path, { encoding: "utf-8" });
    const banlist: Ban[] = JSON.parse(file.toString());
    const ban = banlist.find(ban => ban.banid == parseInt(banID));

    return ban;
};

export const getBanBySteam = async(hex: string) => {
    const file = await readFile(path, { encoding: "utf-8" });
    const banlist: Ban[] = JSON.parse(file.toString());
    const ban = banlist.reverse().find(ban => ban.identifiers.includes(`steam:${hex}`));

    return ban;
};

export default async function ({ interaction, client }: ModalSubmitArgs) {
    if (!existsSync(path))
        return await interaction.Error("Funkcja niedostępna na tym komputerze, skontaktuj się z administracją!", { ephemeral: true });

    if (!interaction.inGuild())
        return await interaction.Error("To polecenie można wykonać tylko na serwerze!", { ephemeral: true });

    const banID = interaction.fields.getTextInputValue("banID");
    const reason = interaction.fields.getTextInputValue("reason");
    const rateLimit = client.getRatelimit("unban", interaction.user.id);

    if (rateLimit && !client.hasExpired("unban", interaction.user.id))
        return await interaction.Error(`Jesteś ograniczony czasowo! Kolejne odwołanie możesz napisać <t:${Math.floor(rateLimit.getTime() / 1000)}>`, { ephemeral: true });

    if (isNaN(parseInt(banID)))
        return await interaction.Error("Wprowadzono nieprawidłowe ID bana", { ephemeral: true });

    const ban = await getBan(banID);

    if (!ban || !ban.identifiers.includes(`discord:${interaction.user.id}`))
        return await interaction.Error("Nie znaleziono bana nałożonego na twoje konto discord! Odwołaj się na tickecie", { ephemeral: true });

    const unbanChannel = await client.database.config.get("unbanFormAdminChannel");

    if (unbanChannel === false)
        return await interaction.Error("Wystąpił błąd bazy danych, skontaktuj się z administracją!", { ephemeral: true });

    if (unbanChannel === null)
        return await interaction.Error("Nie ustawiono kanału administracyjnego, skontaktuj się z administracją!", { ephemeral: true });

    const channel = await interaction.guild?.channels.fetch(unbanChannel);

    if (!channel)
        return await interaction.Error("Nie udało się znaleźć kanału administracyjnego, skontaktuj się z administracją!", { ephemeral: true });

    if (!channel.isTextBased())
        return await interaction.Error("Kanał administracyjny nie jest tekstowy, skontaktuj się z administracją!", { ephemeral: true });

    const actionRow = new ActionRowBuilder<ButtonBuilder>();
    actionRow.addComponents(
        new ButtonBuilder().setCustomId(`acceptUnbanModal-${banID}`).setLabel("Zaakceptuj").setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`denyUnbanModal-${banID}`).setLabel("Odrzuć").setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`shortenBanForm-${banID}`).setLabel("Skróć").setStyle(ButtonStyle.Primary)
    );

    /* check if banner is in administration */
    /* if is ping banner else ping management */

    let messageContent = `Podanie o unbana od <@${interaction.user.id}> \`(${interaction.user.id})\``;

    const bannerDiscordID = await client.database.players.getDiscordBySteam(ban.bannersteam);

    if (bannerDiscordID === false)
        return await interaction.Error("Wystąpił błąd bazy danych, skontaktuj się z administracją!", { ephemeral: true });

    if (bannerDiscordID === null)
        return await interaction.Error("Nie znaleziono discorda administratora, odwołaj się na tickecie!", { ephemeral: true });

    const bannerDiscordUser = bannerDiscordID[0] !== null ? await interaction.guild?.members.fetch(bannerDiscordID[0].replace("discord:", "")).catch(() => undefined) : undefined;

    ban.banner = bannerDiscordUser ? `<@${bannerDiscordID[0].replace("discord:", "")}>` : null || "`Nie znaleziono`";

    if (ban.banner == "`Nie znaleziono`")
        messageContent += " | <@&843444626726584370>, nie znaleziono administratora!";
    else if (bannerDiscordUser && !bannerDiscordUser.roles.cache.has("843444642539110400"))
        messageContent += " | <@&843444626726584370>, banujący nie jest w administracji!";

    await channel.send({
        content: messageContent,
        embeds: [
            Embed({
                title: "Odwołanie od bana",
                fields: [
                    { name: "Nazwa użytkownika", value: `\`${ban.name}\``, inline: false },
                    { name: "ID bana", value: `\`${ban.banid}\``, inline: false },
                    { name: "Banujący", value: ban.banner, inline: false },
                    { name: "Powód bana", value: `\`${ban.reason.split("( Gracz")[0].trim()}\``, inline: false },
                    { name: "Treść odwołania", value: `\`\`\`${reason}\`\`\``, inline: false },
                ],
                user: interaction.user
            })
        ],
        components: [ actionRow ]
    });

    client.addRateLimit("unban", interaction.user.id, 1000 * 60 * 60 * 2);

    return await interaction.Reply("Twoje odwołanie zostało przesłane", { ephemeral: true });
}

export const info: ModalSubmitInfoType = {
    name: "unban_form",
    roles: [ Roles.Czlonek ]
};
