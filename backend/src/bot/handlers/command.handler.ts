import PluginHandler from "../handlers/plugin.handler";

// prettier-ignore
export default class Handler {
	private PluginHandler: PluginHandler;

	constructor(pluginHandler: PluginHandler) {
		this.PluginHandler = pluginHandler;
	}

	get(name: string): Command | undefined {
		const plugin = this.PluginHandler.plugins.find(plugin => plugin.commands.find(cmd => cmd.info.triggers.includes(name)));

		if (!plugin) return;
		else return plugin.commands.find(cmd => cmd.info.triggers.includes(name));
	}
}
