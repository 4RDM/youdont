export default async function ({ client }: { client: ClientType }) {
	client.logger.ready("Bot is ready!");

	const reloadStats = () => {};

	setInterval(reloadStats, 10000);
}

export const info: EventInfo = {
	eventName: "ready",
};
