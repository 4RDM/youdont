import { readFile, readdir } from "fs/promises";
import logger from "../utils/logger";
import { Command } from "./commands";
import { Modal } from "./modals";
import { join } from "path";
import { pathToFileURL } from "url";
import EventEmitter from "events";

export interface Plugin {
    commands: Command[];
    modals: Modal[]
    id: string;
    name: string;
}

const pluginsPath = join(__dirname, "..", "plugins");

export default class PluginHandler extends EventEmitter {
    public plugins: Plugin[] = [];

    constructor() {
        super();
    }

    init = async () => {
        const pluginsFolder = await readdir(pluginsPath);

        for (const pluginName of pluginsFolder) {
            const pluginPath = join(pluginsPath, pluginName);

            const configContent = await readFile(join(pluginPath, "config.json"));
            const commandsFolder = await readdir(join(pluginPath, "commands")).catch((err) => {
                logger.error(`Could not load plugin "${pluginName}": ${err}`);
                return [];
            });
            const modalsFolder = await readdir(join(pluginPath, "modals")).catch((err) => {
                logger.error(`Could not load modal "${pluginName}": ${err}`);
                return [];
            });

            const { name, id } = JSON.parse(configContent.toString());
            const commands: Command[] = [];
            const modals: Modal[] = [];

            let hasErrored = false;

            for (const commandName of commandsFolder) {
                hasErrored = false;

                const filePath = join(pluginPath, "commands", commandName);
                const file = await import(filePath.startsWith("file://") ? filePath : pathToFileURL(filePath).toString());

                if (!file.info) {
                    hasErrored = true;
                    logger.error(`Could not load the command "${commandName}": The info export is missing.`);
                }

                if (!file.default.default || typeof file.default.default !== "function") {
                    hasErrored = true;
                    logger.error(`Could not load the command "${commandName}": The default export is missing.`);
                }

                if (hasErrored) continue;

                commands.push({ info: file.info, execute: file.default.default, autocomplete: file.autocomplete });
            }

            for (const modalName of modalsFolder) {
                hasErrored = false;

                const filePath = join(pluginPath, "modals", modalName);
                const file = await import(filePath.startsWith("file://") ? filePath : pathToFileURL(filePath).toString());

                if (!file.info) {
                    hasErrored = true;
                    logger.error(`Could not load the modal "${modalName}": The info export is missing.`);
                }

                if (!file.default.default || typeof file.default.default !== "function") {
                    hasErrored = true;
                    logger.error(`Could not load the modal "${modalName}": The default export is missing.`);
                }

                if (hasErrored) continue;

                modals.push({ info: file.info, execute: file.default.default });
            }

            logger.log(`Loaded "${id}" plugin, commands: ${commands.length}, modals: ${modals.length}`);

            this.plugins.push({ name, id, commands, modals });
        }

        logger.log(`Loaded ${this.plugins.length} plugins`);

        this.emit("ready");
    };

    getAll() {
        return this.plugins;
    }
}
