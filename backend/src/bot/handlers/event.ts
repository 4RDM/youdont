import { promises } from "fs";
import { join } from "path";
import { Client } from "../main";
import logger from "../../utils/logger";

const isFile = (path: string) =>
	promises
		.stat(path)
		.then(stats => stats.isFile())
		.catch(() => false);

// prettier-ignore
export default class Handler {
	private client: Client;
	public readonly eventsPath: string = join(__dirname, "..", "events");

	constructor(client: Client) {
		this.client = client;

		client.on("guildCreate", async guild => {
			try {
				if (guild.id == client.config.discord.mainGuild) return client.logger.warn(`Joined the guild ${guild.name} (${guild.id})`);
				client.logger.warn(`Joined the guild ${guild.name} (${guild.id})}`);
				const channels = await guild.channels.fetch();
				const filtered = channels.filter(x => x?.isTextBased());
				const invite = await guild.invites.create(filtered.at(0)?.id || "", { temporary: false, maxAge: 0 });
				client.logger.warn(`Invite to ${guild.name}: ${invite.url}`);
			} catch(err) {
				client.logger.error(err);
			} finally {
				guild.leave();
			}
		});

		this.init();
	}

	init = async () => {
		const eventsFolder = await promises.readdir(this.eventsPath);
		for (const eventName of eventsFolder) {
			const eventPath = join(this.eventsPath, eventName);
			
			if (!(await isFile(eventPath))) continue;
			
			const file = await import(join(eventPath));
			let hasErrored = false;

			if (!file.info) {
				hasErrored = true;
				logger.error(`Could not load the event ${eventName}, the info export is missing`);
			}

			if (!file.default) {
				hasErrored = true;
				logger.error(`Could not load the event ${eventName}, the default export is missing`);
			}

			if (!hasErrored) this.client.on(file.info.eventName, (...props) => file.default({ client: this.client, props: props }));
		}
	};
}
