import { Interaction } from "discord.js";
import { handleButtonInteraction } from "./interactions/button";
import { handleModalInteraction } from "./interactions/modalSubmit";
import { handleCommandInteraction } from "./interactions/command";
import { handleAutocompleteInteraction } from "./interactions/autocomplete";

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

	if (interaction.guildId !== client.config.discord.mainGuild) return;

	interaction.hasReplied = false;
	interaction.Reply = async(options) => {
		if (!interaction.isRepliable()) return;

		if (interaction.hasReplied) return interaction.followUp(options);
		else {
			interaction.hasReplied = true;
			return interaction.reply(options);
		}
	};

	if (interaction.isCommand())
		handleCommandInteraction(client, interaction);
	else if (interaction.isButton())
		handleButtonInteraction(client, interaction);
	else if (interaction.isModalSubmit())
		handleModalInteraction(client, interaction);
	else if (interaction.isAutocomplete())
		handleAutocompleteInteraction(client, interaction);
}

export const info: EventInfo = {
	eventName: "interactionCreate",
};
