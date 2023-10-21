import { AutocompleteInteraction, CommandInteraction, PermissionResolvable, SlashCommandBuilder } from "discord.js";
import { RDMBot } from "../main";
import PluginHandler from "./plugins";

export type CommandArgs = { client: RDMBot, interaction: CommandInteraction };
export type AutocompleteArgs = { client: RDMBot, interaction: AutocompleteInteraction };
export interface CommandInfoType {
    name: string;
    description: string;
    role?: string[];
    permissions?: PermissionResolvable;
    builder: SlashCommandBuilder;
}

export interface Command {
    info: CommandInfoType;
    execute(args: CommandArgs): Promise<void>;
    autocomplete?(args: AutocompleteArgs): Promise<void>;
}

export default class CommandHandler {
    public commands = new Map<string, Command>();

    constructor(pluginHandler: PluginHandler) {
        pluginHandler.once("ready", () => {
            const commands = pluginHandler.getAll().flatMap(plugin => plugin.commands);
            commands.forEach(command => this.commands.set(command.info.name, command));
        });
    }

    getAll() {
        return this.commands;
    }

    get(name: string) {
        return this.commands.get(name);
    }
}
