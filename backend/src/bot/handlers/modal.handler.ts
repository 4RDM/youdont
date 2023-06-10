import { existsSync, promises } from "fs";
import { join } from "path";
import logger from "../../utils/logger";
import { Client } from "../main";
import { ModalBuilder } from "discord.js";

export type Modal = {
	execute: (args: string) => ModalBuilder;
	name: string;
};

// prettier-ignore
export class ModalHandler {
	public modals: Map<string, Modal> = new Map();
	public readonly pluginsPath: string = join(__dirname, "..", "plugins");

	constructor(private readonly client: Client) {
		this.init();
	}

	init = async () => {
		const pluginsFolder = await promises.readdir(this.pluginsPath);
		for (const pluginName of pluginsFolder) {
			const pluginPath = join(this.pluginsPath, pluginName);

			if (!existsSync(pluginPath)) continue;

			const modalsFolder = await promises.readdir(join(pluginPath, "modals"));

			for (const modalName of modalsFolder) {
				const file = await import(join(pluginPath, "modals", modalName));

				if (!file.info) {
					logger.error(`Could not load the modal ${modalName}, the info export is missing`);
					continue;
				}

				if (!file.default) {
					logger.error(`Could not load the modal ${modalName}, the default export is missing`);
					continue;
				}

				this.modals.set(modalName, { execute: file.default, name: modalName });
			}
		}
	};

	get(name: string): Modal | undefined {
		return this.modals.get(name);
	}
}
