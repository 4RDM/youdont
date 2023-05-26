import { promises } from "fs";
import { Plugin } from "../../types";
import { join } from "path";
import logger from "../../utils/logger";

// prettier-ignore
export default class Handler {
	public plugins: Plugin[] = [];
	public readonly pluginsPath: string = join(__dirname, "..", "plugins");

	constructor() {
		this.init(); // for async sake
	}

	init = async () => {
		const pluginsFolder = await promises.readdir(this.pluginsPath);
		for (const pluginName of pluginsFolder) {
			const pluginPath = join(this.pluginsPath, pluginName);

			const configContent = await promises.readFile(join(pluginPath, "config.json"));
			const commandsFolder = await promises.readdir(join(pluginPath, "commands"));

			const { name, description, id } = JSON.parse(configContent.toString());
			const commands: Command[] = [];
			let hasErrored = false;

			for (const commandName of commandsFolder) {
				const file = await import(join(pluginPath, "commands", commandName));

				if (!file.info) {
					hasErrored = true;
					logger.error(`Could not load the command ${commandName}, the info export is missing`);
				}

				if (!file.default) {
					hasErrored = true;
					logger.error(`Could not load the command ${commandName}, the default export is missing`);
				}

				if (hasErrored) continue;

				commands.push({ info: file.info, execute: file.default });
			}

			if (hasErrored) logger.warn(`Some commands were not loaded in plugin "${name}" due to an error`);

			logger.log(`Loaded ${id} plugin`);
			this.plugins.push({ name, description, id, commands });
		}

		logger.log(`Loaded ${this.plugins.length} plugins`);
	};

	get(name: string): Plugin | undefined {
		return this.plugins.find(plugin => plugin.id === name);
	}
}
