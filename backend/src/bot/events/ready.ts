import { ActivityType, TextChannel } from "discord.js";
import { getTops, getPlayers } from "../../utils/serverStatus";
import { Embed } from "../../utils/discordEmbed";
import chalk from "chalk";

const reloadStats = async (client: ClientType, statsChannel: TextChannel) => {
    const stats = await getTops(client.core);

    if (!stats)
        return client.logger.error("Cannot estabilish connection with database");

    const topsMessage = await statsChannel.messages.fetch(client.config.discord.topsMessage);
    if (!topsMessage)
        return client.logger.error("Tops message not found");

    const killEmbed = Embed({ color: "#6f42c1", timestamp: new Date(), title: ":bar_chart: | Topka killi", description: stats.kills.map(({ value, name }, i) => `**${i + 1}**: \`${name}\` (${value} killi)`).join("\n") });
    const deathsEmbed = Embed({ color: "#6f42c1", timestamp: new Date(), title: ":bar_chart: | Topka śmierci", description: stats.deaths.map(({ value, name }, i) => `**${i + 1}**: \`${name}\` (${value} śmierci)`).join("\n") });
    const kdrEmbed = Embed({ color: "#6f42c1", timestamp: new Date(), title: ":bar_chart: | Topka KDR", description: stats.kdr.map(({ value, name }, i) => `**${i + 1}**: \`${name}\` (${value} kdr)`).join("\n") });
	
    statsChannel.messages.edit(topsMessage, {
        embeds: [killEmbed, deathsEmbed, kdrEmbed],
        content: "",
    }).catch((err) => client.logger.error(`Error occured while edditing stats message: ${err} (src/bot/events/ready.event.ts)`));
};

const reloadStatus = async (client: ClientType, statusChannel: TextChannel) => {
    const statusMessage = await statusChannel.messages.fetch(client.config.discord.statusMessage);
    if (!statusMessage)
        return client.logger.error("Status message not found");

    const players = await getPlayers();

    if (!players) {
        statusMessage.edit({
            embeds: [
                Embed({
                    title: ":x: | 4RDM jest offline!",
                    color: "#f54242",
                    timestamp: new Date(),
                }),
            ],
        }).catch((err) => client.logger.error(`Error occured while edditing kdr message: ${err} (src/bot/events/ready.event.ts)`));
        client.user?.setActivity("4RDM jest offline!", { type: ActivityType.Streaming });
    } else {
        statusMessage.edit({
            embeds: [
                Embed({
                    title: ":white_check_mark: | 4RDM jest online!",
                    description: `**Graczy online:** ${players.length}/${client.config.maxPlayers}\n\n${players.sort((a, b) => a.id - b.id).map(x => `**${x.id}**: \`${x.name.replace(/`/gm, "")}\``).join("\n")}`,
                    color: "#1F8B4C",
                    timestamp: new Date(),
                }),
            ],
        }).catch((err) => client.logger.error(`Error occured while edditing kdr message: ${err} (src/bot/events/ready.event.ts)`));
        client.user?.setActivity(`${players.length} / ${client.config.maxPlayers} 👥`, { type: ActivityType.Watching });
    }
};

export default async function ({ client }: { client: ClientType }) {
    client.logger.ready("Bot is ready!");

    client.guilds.cache.filter(a => a.id !== client.config.discord.mainGuild).forEach(x => {
        x.leave();
        client.logger.warn("Opuszczam: ", x.name);
    });

    if (process.env.NODE_ENV !== "production") {
        client.user?.setActivity("DEV MODE", { type: ActivityType.Listening });
        client.logger.warn("Bot is running in development mode!");

        let connectionState = await client.core.database.serverpool.getConnection().then(() => chalk.bgGreen("OK")).catch(() => chalk.bgRed("ERROR"));
        client.logger.warn(`DEV MariaDB serverpool test connection: ${connectionState}`);

        connectionState = await client.core.database.botpool.getConnection().then(() => chalk.bgGreen("OK")).catch(() => chalk.bgRed("ERROR"));
        client.logger.warn(`DEV MariaDB botpool test connection: ${connectionState}`);

        return;
    }

    const statsChannel = await client.channels.fetch(client.config.discord.statsChannel, { force: true });
    if (statsChannel && statsChannel.isTextBased()) setInterval(() => reloadStats(client, statsChannel as TextChannel), 12000);
    else client.logger.error("Stats channel is not text based or not found");

    const statusChannel = client.channels.cache.get(client.config.discord.statusChannel);
    if (statusChannel && statusChannel.isTextBased()) setInterval(() => reloadStatus(client, statusChannel as TextChannel), 12000);
    else client.logger.error("Status channel is not text based or not found");
}

export const info: EventInfo = {
    eventName: "ready",
};
