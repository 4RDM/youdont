import { ActivityType, TextChannel } from "discord.js";
import { getTops, getPlayers } from "../../utils/serverStatus";
import { Embed } from "../../utils/discordEmbed";

// prettier-ignore
const reloadStats = async (client: ClientType, statsChannel: TextChannel) => {
	const stats = await getTops(client.Core);

	if (!stats)
		return client.logger.error("Cannot estabilish connection with database");

	const killTopMessage = await statsChannel.messages.fetch(client.config.discord.killMessage);
	const deathsTopMessage = await statsChannel.messages.fetch(client.config.discord.deathsMessage);
	const kdrTopMessage = await statsChannel.messages.fetch(client.config.discord.kdrMessage);

	if (!killTopMessage)
		return client.logger.error("Kill top message not found");
	else if (!deathsTopMessage)
		return client.logger.error("Deaths top message not found");
	else if (!kdrTopMessage)
		return client.logger.error("KDR top message not found");

	statsChannel.messages.edit(killTopMessage, {
		embeds: [Embed({ color: "#6f42c1", timestamp: new Date(), title: ":bar_chart: | Topka killi", description: stats.kills.map(({ value, name }, i) => `**${i + 1}**: \`${name}\` (${value} killi)`).join("\n") })],
		content: "",
	}).catch((err) => client.logger.error(`Error occured while edditing kill message: ${err} (src/bot/events/ready.event.ts)`));

	statsChannel.messages.edit(deathsTopMessage, {
		embeds: [Embed({ color: "#6f42c1", timestamp: new Date(), title: ":bar_chart: | Topka śmierci", description: stats.deaths.map(({ value, name }, i) => `**${i + 1}**: \`${name}\` (${value} śmierci)`).join("\n") })],
		content: "",
	}).catch((err) => client.logger.error(`Error occured while edditing death message: ${err} (src/bot/events/ready.event.ts)`));

	statsChannel.messages.edit(kdrTopMessage, {
		embeds: [Embed({ color: "#6f42c1", timestamp: new Date(), title: ":bar_chart: | Topka KDR", description: stats.kdr.map(({ value, name }, i) => `**${i + 1}**: \`${name}\` (${value} kdr)`).join("\n") })],
		content: "",
	}).catch((err) => client.logger.error(`Error occured while edditing kdr message: ${err} (src/bot/events/ready.event.ts)`));
};

// prettier-ignore
const reloadStatus = async (client: ClientType, statusChannel: TextChannel) => {
	const statusMessage = await statusChannel?.messages.fetch(client.config.discord.statusMessage);
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
					description: `**Graczy online:** ${players.length}/${client.config.maxPlayers}\n\n${players.sort((a, b) => a.id - b.id).map(x => `${x.id}. \`${x.name.replace(/`/gm, "")}\``).join("\n")}`,
					color: "#1F8B4C",
					timestamp: new Date(),
				}),
			],
		}).catch((err) => client.logger.error(`Error occured while edditing kdr message: ${err} (src/bot/events/ready.event.ts)`));
		client.user?.setActivity(`${players.length} / ${client.config.maxPlayers} 👥`, { type: ActivityType.Watching });
	}
};

// prettier-ignore
export default async function ({ client }: { client: ClientType }) {
	client.logger.ready("Bot is ready!");

	if (process.env.NODE_ENV !== "production")
		return client.logger.warn("Bot is running in development mode!");

	const statsChannel = await client.channels.fetch(client.config.discord.statsChannel, { force: true });
	if (statsChannel && statsChannel.isTextBased()) setInterval(() => reloadStats(client, statsChannel as TextChannel), 12000);
	else client.logger.error("Stats channel is not text based or not found");

	const statusChannel = client.channels.cache.get(client.config.discord.statusChannel);
	if (statusChannel && statusChannel.isTextBased()) setInterval(() => reloadStatus(client, statusChannel as TextChannel), 12000);
	else client.logger.error("Stats channel is not text based or not found");
}

export const info: EventInfo = {
	eventName: "ready",
};
