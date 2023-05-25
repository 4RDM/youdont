import { promises } from "fs";
import { Plugin } from "../../types";
import { join } from "path";
import logger from "../../utils/logger";

export default class Handler {
	public plugins: Plugin[] = [];
	public readonly pluginsPath: string = join(__dirname, "..", "plugins");

	constructor() {
		this.init();
	}

	init = async () => {
		const pluginsFolder = await promises.readdir(this.pluginsPath);
		for (const pluginName of pluginsFolder) {
			const pluginPath = join(this.pluginsPath, pluginName);

			const configContent = await promises.readFile(
				join(pluginPath, "config.json")
			);
			const commandsFolder = await promises.readdir(
				join(pluginPath, "commands")
			);

			const { name, description, id } = JSON.parse(
				configContent.toString()
			);
			const commands: Command[] = [];
			let hasErrored = false;

			for (const commandName of commandsFolder) {
				const { info, execute } = await import(
					join(pluginPath, "commands", commandName)
				);
				if (!info) {
					hasErrored = true;
					logger.error(
						`Could not load the command ${commandName}, the info export is missing`
					);
				}
				if (!execute) {
					hasErrored = true;
					logger.error(
						`Could not load the command ${commandName}, the execute() export is missing`
					);
				}
				if (hasErrored) continue;
				commands.push({ info, execute });
			}

			if (hasErrored)
				logger.warn(
					`Some commands were not loaded in plugin "${name}" due to an error`
				);
			this.plugins.push({ name, description, id, commands });
		}
		logger.ready(`Loaded ${this.plugins.length} plugins`);
	};

	get(name: string): Plugin | undefined {
		return this.plugins.find(plugin => plugin.id === name);
	}
}
