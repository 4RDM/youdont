import { RDMBot } from "main";
import logger from "utils/logger";
import { handleInteraction } from "./interactions";
import { getTops } from "utils/serverStatus";
import { Channel, TextChannel } from "discord.js";
import { Embed } from "utils/embedBuilder";
import config from "config";

const reloadStats = async (client: RDMBot, statsChannel: TextChannel) => {
    try {
        const stats = await getTops(client);

        if (!stats)
            return logger.error("reloadStats(): Cannot estabilish connection with database");

        const topsMessage = await statsChannel.messages.fetch(config.discord.statsMessage);
        if (!topsMessage)
            return logger.error("reloadStats(): Tops message not found");

        const killsEmbed = Embed({
            title: "Topka killi",
            author: {
                name: "4RDM",
                iconURL: "https://4rdm.pl/assets/logo.png"
            },
            description: stats.kills.map((user, i) => `#**${i + 1}** \`${user.name.replace(/`/gm, "")}\`: **${user.value}** zabójstw`).join("\n"),
            footer: "Statystyki aktualizują się co 10 minut",
            color: "#924ED1",
            timestamp: new Date()
        });

        const deathsEmbed = Embed({
            title: "Topka śmierci",
            author: {
                name: "4RDM",
                iconURL: "https://4rdm.pl/assets/logo.png"
            },
            description: stats.deaths.map((user, i) => `#**${i + 1}** \`${user.name.replace(/`/gm, "")}\`: **${user.value}** śmierci`).join("\n"),
            footer: "Statystyki aktualizują się co 10 minut",
            color: "#924ED1",
            timestamp: new Date()
        });

        const kdrEmbed = Embed({
            title: "Topka KDR",
            author: {
                name: "4RDM",
                iconURL: "https://4rdm.pl/assets/logo.png"
            },
            description: stats.kdr.map((user, i) => `#**${i + 1}** \`${user.name.replace(/`/gm, "")}\`: **${user.value}** KDR`).join("\n"),
            footer: "Statystyki aktualizują się co 10 minut",
            color: "#924ED1",
            timestamp: new Date()
        });

        statsChannel.messages.edit(topsMessage, {
            embeds: [killsEmbed, deathsEmbed, kdrEmbed],
            content: "",
        });

        return true;
    } catch(err) {
        return logger.error(`reloadStats(): Error occured while edditing stats message: ${err}`);
    }
};

export class EventHandler {
    constructor(private client: RDMBot) {
        this.client.once("ready", async (readyClient) => {
            try {
                logger.ready(`${readyClient.user.tag} is ready!`);

                const statsChannel = (await readyClient.channels.fetch(config.discord.statsChannel, { cache: true, force: true }).catch(() => false)) as Channel | false;

                if (!statsChannel || statsChannel == null)
                    return logger.error("EventHandler(): Stats channel not found!") as unknown as void;

                if (!statsChannel.isTextBased())
                    return logger.error("EventHandler(): Stats channel is not text based!") as unknown as void;

                if (statsChannel.isDMBased())
                    return logger.error("EventHandler(): Stats channel is DM based!") as unknown as void;

                setInterval(async () => {
                    await reloadStats(client, statsChannel as TextChannel);
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