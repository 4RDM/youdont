import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Message, ModalSubmitInteraction, TextChannel, ThreadAutoArchiveDuration } from "discord.js";
import { Client } from "../../main";
import { accept } from "../../plugins/server/commands/zaakceptuj";
import { Embed } from "utils/discordEmbed";
import { join } from "path";
import { readFile } from "fs/promises";

const banlistPath =
    process.env.NODE_ENV == "production" ?
        "/home/rdm/server/data/resources/[4rdm]/EasyAdmin-6/banlist.json" :
        join(__dirname, "..", "..", "..", "data", "banlist.json");

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
    const file = await readFile(banlistPath, { encoding: "utf-8" });
    const banlist: Ban[] = JSON.parse(file.toString());
    const ban = banlist.find(ban => ban.banid == parseInt(banID));

    return ban;
};

export const handleModalInteraction = async (client: Client, interaction: ModalSubmitInteraction) => {
    if (!interaction.isModalSubmit()) return;

    const [commandName, ...args] = interaction.customId.split("_");

    if (commandName == "unban") {
        const userID = args[1];
        const banID = interaction.fields.getTextInputValue("banID");
        const description = interaction.fields.getTextInputValue("description");
        const rateLimit = client.getRatelimit("unban", userID);

        if (rateLimit && !client.hasExpired("unban", userID))
            return await interaction.Reply({ content: `Jesteś ograniczony czasowo! Kolejne odwołanie możesz napisać <t:${Math.floor(rateLimit.getTime() / 1000)}>`, ephemeral: true });

        // if (!rateLimit)
        //     client.addRateLimit("unban", userID, 6 * 60 * 60 * 1000);

        if (isNaN(parseInt(banID)))
            return await interaction.Reply({ content: "Wprowadzono nieprawidłowe ID bana", ephemeral: true });

        const ban = await getBan(banID);

        if (!ban || !ban.identifiers.includes(`discord:${userID}`))
            return await interaction.Reply({ content: "Nie znaleziono bana nałożonego na twoje konto discord! Odwołaj się na tickecie", ephemeral: true });

        const banner = await client.core.database.playerData.getDiscordBySteam(ban.bannersteam);

        if (!banner)
            return await interaction.Reply({ content: "Wystąpił błąd bazy danych! Odwołaj się na tickecie", ephemeral: true });

        if (!banner[0])
            return await interaction.Reply({ content: "Nie znaleziono banującego! Odwołaj się na tickecie", ephemeral: true });

        const bannerDiscord = banner[0].replace(/discord:/gm, "");

        const res = await client.core.database.playerData.createUnban(banID);

        if (!res)
            return await interaction.Reply("Wystąpił błąd bazy danych (modalSubmit)");

        const embed = Embed({
            title: "Odwołanie od unbana",
            description: `**Nick:** \`${ban.name}\`\n**Powód:** \`${ban.reason.replace(/( [(] Gracz*.+)/gm, "")}\`\n**Ban przedawnia się:** \`${ban.expireString}\`\n**Administrator:** <@${bannerDiscord}>\n\n**Dlaczego powinieneś dostać unbana:**\n\`\`\`${description}\`\`\``,
            color: "#0685ee"
        });

        const actionRow = new ActionRowBuilder<ButtonBuilder>();
        actionRow.addComponents(new ButtonBuilder().setCustomId(`unbanButton_accept_${banID}`).setLabel("Zaakceptuj").setStyle(ButtonStyle.Success).setEmoji("✔"));
        actionRow.addComponents(new ButtonBuilder().setCustomId(`unbanButton_deny_${banID}`).setLabel("Odrzuć").setStyle(ButtonStyle.Danger).setEmoji("✖️"));
        actionRow.addComponents(new ButtonBuilder().setCustomId(`unbanButton_shorten_${banID}`).setLabel("Skróć bana").setStyle(ButtonStyle.Primary).setEmoji("⌚"));

        const interactionRes = await interaction.Reply({ embeds: [embed], content: `<@${bannerDiscord}>`, components: [actionRow] });
        const message = await interactionRes?.fetch();

        if (message instanceof Message) {
            const thread = await (message.channel as TextChannel).threads.create({
                name: `Dyskusja ID: ${banID}`,
                autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
                rateLimitPerUser: 10,
                type: ChannelType.PrivateThread,
            });

            await thread.members.add(bannerDiscord);
            await thread.members.add(userID);
        }
    }

    if (commandName == "donateAcceptModal") {
        accept(client, interaction, parseInt(args[0]), parseInt(interaction.fields.getTextInputValue("donateAcceptModalInput")));
    }
};
