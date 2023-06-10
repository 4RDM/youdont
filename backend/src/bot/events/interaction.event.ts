import { Interaction } from "discord.js";
import { handleButtonInteraction } from "./interactions/button.interaction";
import { handleModalInteraction } from "./interactions/modalSubmit.interaction";
import { handleCommandInteraction } from "./interactions/command.interaction";

// prettier-ignore
export default async function ({
	client,
	props,
}: {
	client: ClientType;
	props: { "0": Interaction };
}) {
	const interaction = props["0"];

	if (!interaction.inGuild()) return;

	if (interaction.isCommand())
		handleCommandInteraction(client, interaction);
	else if (interaction.isButton())
		handleButtonInteraction(client, interaction);
	else if (interaction.isModalSubmit())
		handleModalInteraction(client, interaction);
}

export const info: EventInfo = {
	eventName: "interactionCreate",
};
