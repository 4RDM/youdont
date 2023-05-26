import { getTops } from "../../utils/serverStatus";

export default async function ({ client }: { client: ClientType }) {
	client.logger.ready("Bot is ready!");

	const status = await getTops(client.Core);

	// prettier-ignore
	if (!status)
		return client.logger.error("Cannot estabilish first connection with FiveM");

	const reloadStats = async () => {
		const status = await getTops(client.Core);

		if (!status) {
			client.logger.error("FiveM statistics cannot be updated");
			clearInterval(interval);
		}

		console.log(status);
	};

	const interval = setInterval(reloadStats, 10000);
}

export const info: EventInfo = {
	eventName: "ready",
};
