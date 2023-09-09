import { existsSync, promises } from "fs";
import { join } from "path";
import logger from "../../utils/logger";
import { ModalBuilder } from "discord.js";

export type Modal = {
	execute: (_: string) => ModalBuilder;
	name: string;
};


export class ModalHandler {
    public modals: Map<string, Modal> = new Map();
    public readonly pluginsPath: string = join(__dirname, "..", "plugins");

    constructor() {
        this.init();
    }

    init = async () => {
        const pluginsFolder = await promises.readdir(this.pluginsPath);

        for (const pluginName of pluginsFolder) {
            const pluginPath = join(this.pluginsPath, pluginName);
            const modalsPath = join(pluginPath, "modals");

            if (!existsSync(modalsPath)) continue;

            const modalsFolder = await promises.readdir(modalsPath);

            for (const modalName of modalsFolder) {
                const file = await import(join(pluginPath, "modals", modalName));

                if (!file.info) {
                    logger.error(`Could not load the modal ${modalName}, the info export is missing`);
                    continue;
                }

                if (!file.modal) {
                    logger.error(`Could not load the modal ${modalName}, the handler modal is missing`);
                    continue;
                }

                this.modals.set(file.info.name, { execute: file.modal, name: file.info.name });
            }
        }
    };

    get(name: string): Modal | undefined {
        return this.modals.get(name);
    }
}
