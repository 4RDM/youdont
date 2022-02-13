import { readFileSync as rf, readdirSync as rd } from "fs";
import { Plugin, Command } from "../../types";
import logger from "../../utils/logger";
import { join } from "path";

export default class Handler {
	public plugins: Plugin[] = [];
	public readonly pluginsPath: string = join(__dirname, "..", "plugins");

	constructor() {
		rd(this.pluginsPath).forEach(pluginName => {
			// prettier-ignore
			const content = rf(join(this.pluginsPath, pluginName, "config.json")).toString();
			const { name, description, id } = JSON.parse(content);
			const commands: Command[] = [];

			// prettier-ignore
			rd(join(this.pluginsPath, pluginName, "commands")).forEach(commandName => {
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				commands.push(require(join(this.pluginsPath, pluginName, "commands", commandName)));
			});

			this.plugins.push({
				name,
				description,
				id,
				commands,
			});
		});

		logger.log(`Loaded ${this.plugins.length} plugins`);
	}

	get(name: string): Plugin | undefined {
		return this.plugins.find(plugin => plugin.id === name);
	}
}
