import { ActivityType } from "discord.js";
import { getTops, getPlayers } from "../../utils/serverStatus";
import { Embed } from "../../utils/discordEmbed";

// prettier-ignore
export default async function ({ client }: { client: ClientType }) {
	client.logger.ready("Bot is ready!");

	const stats = await getTops(client.Core);
	if (!stats)
		return client.logger.error("Cannot estabilish first connection with FiveM");

	const statsChannel = client.channels.cache.get(client.config.discord.statsChannel);
	if (!statsChannel?.isTextBased() || !statsChannel)
		return client.logger.error("Stats channel is not text based or not found");

	const reloadStats = async () => {
		const stats = await getTops(client.Core);

		if (!stats) {
			client.logger.error("FiveM statistics cannot be updated");

			clearInterval(statsInterval);
			setTimeout(() => (statsInterval = setInterval(reloadStats, 12000)), 120000);

			return;
		}

		const killTopMessage = await statsChannel?.messages.fetch(client.config.discord.killMessage);
		const deathsTopMessage = await statsChannel?.messages.fetch(client.config.discord.deathsMessage);
		const kdrTopMessage = await statsChannel?.messages.fetch(client.config.discord.kdrMessage);

		if (!killTopMessage) {
			clearInterval(statsInterval);
			return client.logger.error("Kill top message not found");
		} else if (!deathsTopMessage) {
			clearInterval(statsInterval);
			return client.logger.error("Deaths top message not found");
		} else if (!kdrTopMessage) {
			clearInterval(statsInterval);
			return client.logger.error("KDR top message not found");
		}

		killTopMessage.edit({
			embeds: [Embed({ color: "#6f42c1", timestamp: new Date(), title: ":bar_chart: | Topka killi", description: stats.kills.map(({ value, name }, i) => `**${i + 1}**: \`${name}\` (${value} killi)`).join("\n") })],
			content: "",
		}).catch((err) => client.logger.error(`Error occured while edditing kill message: ${err} (src/bot/events/ready.event.ts)`));

		deathsTopMessage.edit({
			embeds: [Embed({ color: "#6f42c1", timestamp: new Date(), title: ":bar_chart: | Topka śmierci", description: stats.deaths.map(({ value, name }, i) => `**${i + 1}**: \`${name}\` (${value} śmierci)`).join("\n") })],
			content: "",
		}).catch((err) => client.logger.error(`Error occured while edditing death message: ${err} (src/bot/events/ready.event.ts)`));

		kdrTopMessage.edit({
			embeds: [Embed({ color: "#6f42c1", timestamp: new Date(), title: ":bar_chart: | Topka KDR", description: stats.kdr.map(({ value, name }, i) => `**${i + 1}**: \`${name}\` (${value} kdr)`).join("\n") })],
			content: "",
		}).catch((err) => client.logger.error(`Error occured while edditing kdr message: ${err} (src/bot/events/ready.event.ts)`));
	};

	let statsInterval = setInterval(reloadStats, 10000);

	const statusChannel = client.channels.cache.get(client.config.discord.statusChannel);
	if (!statusChannel?.isTextBased() || !statusChannel)
		return client.logger.error("Status channel is not text based or not found");

	const reloadPlayers = async () => {
		const players = await getPlayers();

		if (!players) {
			client.logger.error("FiveM players cannot be updated");

			clearInterval(playersInterval);
			setTimeout(() => (playersInterval = setInterval(reloadPlayers, 12000)), 120000);

			return;
		}

		const statusMessage = await statusChannel?.messages.fetch(client.config.discord.statusMessage);
		if (!statusMessage)
			return client.logger.error("Status message not found");

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
		} else {
			statusMessage.edit({
				embeds: [
					Embed({
						title: ":white_check_mark: | 4RDM jest online!",
						description: `**Graczy online:** ${players.length}/${client.config.maxPlayers}\n\n${players.map(x => `${x.id}. \`${x.name.replace(/`/gm, "")}\``).join("\n")}`,
						color: "#1F8B4C",
						timestamp: new Date(),
					}),
				],
			}).catch((err) => client.logger.error(`Error occured while edditing kdr message: ${err} (src/bot/events/ready.event.ts)`));
		}

		client.user?.setActivity(`${players.length} / ${client.config.maxPlayers} 👥`, { type: ActivityType.Watching });
	};

	let playersInterval = setInterval(reloadPlayers, 10000);
}

export const info: EventInfo = {
	eventName: "ready",
};
