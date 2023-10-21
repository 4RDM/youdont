import { readFile, readdir } from "fs/promises";
import { Command } from "./commands";
import { join } from "path";
import logger from "../utils/logger";
import EventEmitter from "events";
import { pathToFileURL } from "url";

export interface Plugin {
    commands: Command[];
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
            const commandsFolder = await readdir(join(pluginPath, "commands"));

            const { name, id } = JSON.parse(configContent.toString());
            const commands: Command[] = [];
            let hasErrored = false;
            let hasErrored2 = false;

            for (const commandName of commandsFolder) {
                hasErrored = false;

                const filePath = join(pluginPath, "commands", commandName);
                const file = await import(filePath.startsWith("file://") ? filePath : pathToFileURL(filePath).toString());

                if (!file.info) {
                    hasErrored = true;
                    hasErrored2 = true;
                    logger.error(`Could not load the command "${commandName}": The info export is missing.`);
                }

                if (!file.default) {
                    hasErrored = true;
                    hasErrored2 = true;
                    logger.error(`Could not load the command "${commandName}": The default export is missing.`);
                }

                if (hasErrored) continue;

                commands.push({ info: file.info, execute: file.default, autocomplete: file.autocomplete });
            }

            if (hasErrored2) logger.warn(`Some commands were not loaded in plugin "${name}" due to an error.`);

            logger.log(`Loaded ${id} plugin`);
            this.plugins.push({ name, id, commands });
        }

        logger.log(`Loaded ${this.plugins.length} plugins`);

        this.emit("ready");
    };

    getAll() {
        return this.plugins;
    }
}
