import { ModalSubmitInteraction, } from "discord.js";
import { RDMBot } from "../main";
import PluginHandler from "./plugins";

export type ModalSubmitArgs = { client: RDMBot, interaction: ModalSubmitInteraction, args?: string[] };
export interface ModalSubmitInfoType {
    name: string;
    roles: string[];
}

export interface Modal {
    info: ModalSubmitInfoType;
    execute(args: ModalSubmitArgs): Promise<void>;
}

export default class ModalsHandler {
    public modals = new Map<string, Modal>();

    constructor(pluginHandler: PluginHandler) {
        pluginHandler.once("ready", () => {
            const modals = pluginHandler.getAll().flatMap(plugin => plugin.modals);
            modals.forEach(modal => this.modals.set(modal.info.name, modal));
        });
    }

    getAll() {
        return this.modals;
    }

    get(name: string) {
        return this.modals.get(name);
    }
}
