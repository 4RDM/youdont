import PluginHandler from "./plugin";

export default class Handler {
	private PluginHandler: PluginHandler;

	constructor(pluginHandler: PluginHandler) {
		this.PluginHandler = pluginHandler;
	}

	all(): Command[] {
		return this.PluginHandler.plugins.flatMap(plugin => plugin.commands);
	}

	get(name: string): Command | undefined {
		const plugin = this.PluginHandler.plugins.find(plugin => plugin.commands.find(cmd => cmd.info.triggers.includes(name)));

		if (!plugin) return;
		else return plugin.commands.find(cmd => cmd.info.triggers.includes(name));
	}
}
