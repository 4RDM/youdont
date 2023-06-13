import { REST, Routes } from "discord.js";
import config from "./config";
import logger from "./utils/logger";

import { Core } from "./core";

// Load commands from command handler!
const client = new Core({ disableHTTP: true });
const commands: unknown[] = [];

setTimeout(() => {
	//
	// Registering slash commands
	//
	const rest = new REST().setToken(config.discord.token);

	(async () => {
		client.bot.commandHandler.all().forEach(command => {
			command.info.builder
				.setName(command.info.triggers[0])
				.setDescription(command.info.description);
			commands.push(command.info.builder.toJSON());
		});

		try {
			logger.log("Refreshing application commands.");

			const data = await rest.put(
				Routes.applicationGuildCommands(
					config.discord.id,
					config.discord.mainGuild
				),
				{
					body: commands,
				}
			);

			logger.ready(
				`Successfully registered ${
					(data as []).length
				} application commands.`
			);
		} catch (error) {
			logger.error(error);
		} finally {
			process.exit();
		}
	})();
}, 10000);
