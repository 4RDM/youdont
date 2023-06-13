import { Interaction } from "discord.js";
import { handleButtonInteraction } from "./interactions/button";
import { handleModalInteraction } from "./interactions/modalSubmit";
import { handleCommandInteraction } from "./interactions/command";

// prettier-ignore
export default async function ({
	client,
	props,
}: {
	client: ClientType;
	props: { "0": Interaction };
}) {
	const interaction = props["0"];

	if (!interaction.inGuild() || interaction.user.bot) return;

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
