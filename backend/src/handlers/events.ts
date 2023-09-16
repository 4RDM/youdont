import { RDMBot } from "main";
import logger from "utils/logger";
import { handleInteraction } from "./interactions";

export class EventHandler {
    constructor(private client: RDMBot) {
        this.client.once("ready", (client) => logger.ready(`${client.user.tag} is ready!`));
        this.client.on("interactionCreate", (interaction) => handleInteraction(interaction));
    }
}