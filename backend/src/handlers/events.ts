import { RDMBot } from "main";
import logger from "utils/logger";
import { handleInteraction } from "./interactions";
import { getPlayers, getTops } from "utils/serverStatus";
import { ActivityType, Channel, TextChannel } from "discord.js";
import { Embed } from "utils/embedBuilder";
import { embedColors } from "utils/constants";

const reloadStats = async (client: RDMBot, statsChannel: TextChannel) => {
    try {
        const stats = await getTops(client);

        if (!stats)
            return logger.error("reloadStats(): Cannot estabilish connection with database");

        const topsMessage = await client.database.config.get("statsMessageID");

        if (topsMessage === false)
            return logger.error("reloadStats(): Database error while fetching statsMessageID");
        if (topsMessage === null)
            return logger.error("reloadStats(): statsMessageID not set");

        const killsEmbed = Embed({
            title: "<:kill:1176598126749036665> | Topka killi",
            author: {
                name: "4RDM",
                iconURL: "https://4rdm.pl/assets/logo.png"
            },
            description: stats.kills.map((user, i) => `#**${i + 1}** \`${user.name.replace(/`/gm, "")}\`: **${user.value}** zabójstw`).join("\n"),
            footer: "Statystyki aktualizują się co 10 minut",
            color: embedColors.purple,
            timestamp: new Date()
        });

        const deathsEmbed = Embed({
            title: "<:death:1176598134198108271> | Topka śmierci",
            author: {
                name: "4RDM",
                iconURL: "https://4rdm.pl/assets/logo.png"
            },
            description: stats.deaths.map((user, i) => `#**${i + 1}** \`${user.name.replace(/`/gm, "")}\`: **${user.value}** śmierci`).join("\n"),
            footer: "Statystyki aktualizują się co 10 minut",
            color: embedColors.purple,
            timestamp: new Date()
        });

        const kdrEmbed = Embed({
            title: "<:kdr:1176598125163585657> | Topka KDR",
            author: {
                name: "4RDM",
                iconURL: "https://4rdm.pl/assets/logo.png"
            },
            description: stats.kdr.map((user, i) => `#**${i + 1}** \`${user.name.replace(/`/gm, "")}\`: **${user.value}** KDR`).join("\n"),
            footer: "Statystyki aktualizują się co 10 minut",
            color: embedColors.purple,
            timestamp: new Date()
        });

        statsChannel.messages.edit(topsMessage, {
            embeds: [ killsEmbed, deathsEmbed, kdrEmbed ],
            content: "",
        });

        return true;
    } catch(err) {
        return logger.error(`reloadStats(): Error occured while edditing stats message: ${err}`);
    }
};

const reloadStatus = async (client: RDMBot, statusChannel: TextChannel) => {
    const status = await getPlayers();

    if (!status)
        client.user?.setPresence({ status: "dnd", activities: [ { name: "4RDM jest offline!", type: ActivityType.Watching } ] });
    else client.user?.setPresence({ status: "idle", activities: [ { name: `${status.length} / ${client.config.maxPlayers}`, type: ActivityType.Watching } ] });

    const statusMessage = await client.database.config.get("statusMessageID");

    if (statusMessage === false)
        return logger.error("reloadStatus(): Database error while fetching statusMessageID");

    if (statusMessage === null)
        return logger.error("reloadStatus(): statusMessageID not set");

    if (!status) {
        const embed = Embed({
            author: {
                name: "4RDM",
                iconURL: "https://4rdm.pl/assets/logo.png"
            },
            color: embedColors.purple,
            title: "<a:odrzucone:846767715807920159> | 4RDM jest offline!",
            footer: "Status aktualizuje się co 5 sekund",
            timestamp: new Date()
        });

        return await statusChannel.messages.edit(statusMessage, {
            embeds: [ embed ],
            content: "",
        });
    }

    const embed = Embed({
        author: {
            name: "4RDM",
            iconURL: "https://4rdm.pl/assets/logo.png"
        },
        color: embedColors.purple,
        title: "<a:zaakceptowane:846767788739657738> | 4RDM jest online!",
        description: `**Graczy online:** ${status.length}/${client.config.maxPlayers}`,
    });

    const playerEmbed = Embed({
        title: "<:coin:1176598132683964517> | Lista graczy",
        description: `${status.sort((a, b) => a.id - b.id).map((player) => `**${player.id}.** \`${player.name.replace(/`/gm, "")}\``).join("\n")}`,
        color: embedColors.green,
        footer: "Status aktualizuje się co 5 sekund",
        timestamp: new Date()
    });

    return await statusChannel.messages.edit(statusMessage, {
        embeds: [ embed, playerEmbed ],
        content: "",
    });
};

export class EventHandler {
    constructor(private client: RDMBot) {
        client.once("ready", async (readyClient) => {
            try {
                logger.ready(`${readyClient.user.tag} is ready!`);

                const statsChannelID = await client.database.config.get("statsChannelID");
                const statusChannelID = await client.database.config.get("statusChannelID");

                if (statsChannelID === false)
                    return logger.error("EventHandler(): Database error while fetching statsChannelID") as unknown as void;

                if (statsChannelID === null)
                    return logger.error("EventHandler(): statsChannelID not set") as unknown as void;

                if (statusChannelID === false)
                    return logger.error("EventHandler(): Database error while fetching statusChannelID") as unknown as void;

                if (statusChannelID === null)
                    return logger.error("EventHandler(): statusChannelID not set") as unknown as void;

                const statsChannel = (await readyClient.channels.fetch(statsChannelID, { cache: true, force: true }).catch(() => false)) as Channel | false;
                const statusChannel = (await readyClient.channels.fetch(statusChannelID, { cache: true, force: true }).catch(() => false)) as Channel | false;

                if (!statsChannel || statsChannel == null)
                    return logger.error("EventHandler(): Stats channel not found!") as unknown as void;

                if (!statusChannel || statusChannel == null)
                    return logger.error("EventHandler(): Status channel not found!") as unknown as void;

                if (!statusChannel.isTextBased())
                    return logger.error("EventHandler(): Status channel is not text based!") as unknown as void;

                if (statusChannel.isDMBased())
                    return logger.error("EventHandler(): Status channel is DM based!") as unknown as void;

                if (!statsChannel.isTextBased())
                    return logger.error("EventHandler(): Stats channel is not text based!") as unknown as void;

                if (statsChannel.isDMBased())
                    return logger.error("EventHandler(): Stats channel is DM based!") as unknown as void;

                setInterval(async () => {
                    await reloadStats(client, statsChannel as TextChannel);
                }, 1000 * 60 * 10);

                setInterval(async () => {
                    await reloadStatus(client, statusChannel as TextChannel);
                }, 5000);
            } catch(err) {
                logger.error(`EventHandler(): Ready handler threw an error: ${err}`);
            }
        });
        this.client.on("interactionCreate", async (interaction) => {
            await handleInteraction(interaction, this.client);
        });
    }
}