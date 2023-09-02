import { promises } from "fs";
import { join } from "path";
import { Plugin } from "../../types";
import logger from "../../utils/logger";

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
			let hasErrored2 = false;
			
			for (const commandName of commandsFolder) {
				hasErrored = false;

				const file = await import(join(pluginPath, "commands", commandName));

				if (!file.info) {
					hasErrored = true;
					hasErrored2 = true;
					logger.error(`Could not load the command ${commandName}, the info export is missing`);
				}

				if (!file.default) {
					hasErrored = true;
					hasErrored2 = true;
					logger.error(`Could not load the command ${commandName}, the default export is missing`);
				}

				if (hasErrored) continue;

				commands.push({ info: file.info, execute: file.default, autocomplete: file.autocomplete });
			}

			if (hasErrored2) logger.warn(`Some commands were not loaded in plugin "${name}" due to an error`);

			logger.log(`Loaded ${id} plugin`);
			this.plugins.push({ name, description, id, commands });
		}

		logger.log(`Loaded ${this.plugins.length} plugins`);
	};

	get(name: string): Plugin | undefined {
		return this.plugins.find(plugin => plugin.id === name);
	}
}
