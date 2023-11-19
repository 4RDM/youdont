import { REST, Routes } from "discord.js";
import RDMBot from "./main";
import config from "./config";
import logger from "./utils/logger";

const client = RDMBot;
const commands: unknown[] = [];

client.plugins.once("ready", () => {
    const rest = new REST().setToken(config.discord.token);

    (async () => {
        client.commands.getAll().forEach(command => {
            command.info.builder
                .setName(command.info.name)
                .setDescription(command.info.description);
            if (command.info.permissions && !command.info.role)
                command.info.builder.setDefaultMemberPermissions(command.info.permissions.toString());
            commands.push(command.info.builder.toJSON());
        });

        try {
            logger.log("Refreshing application commands.");

            const data = await rest.put(Routes.applicationGuildCommands(config.discord.clientId, config.discord.mainGuild), { body: commands });

            logger.ready(`Successfully registered ${(data as []).length} application commands.`);
        } catch (error) {
            logger.error(error);
        } finally {
            process.exit();
        }
    })();
});
