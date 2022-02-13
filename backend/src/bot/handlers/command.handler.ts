import { Command } from "../../types";
import { Client } from "../main";

export default class Handler {
	private client: Client;

	constructor(client: Client) {
		this.client = client;
	}

	get(name: string): Command | undefined {
		const plugin = this.client.PluginHandler.plugins.find(plugin =>
			plugin.commands.find(cmd => cmd.triggers.includes(name))
		);

		if (!plugin) return;
		else {
			return plugin.commands.find(cmd => cmd.triggers.includes(name));
		}
	}
}
