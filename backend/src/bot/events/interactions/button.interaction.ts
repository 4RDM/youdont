import { ButtonInteraction } from "discord.js";
import { Client } from "../../main";
import { odrzuc } from "../../plugins/server/commands/odrzuc";

// prettier-ignore
export const handleButtonInteraction = async (client: Client, interaction: ButtonInteraction) => {
	if (!interaction.isButton()) return;

	const [commandName, ...args] = interaction.customId.split("_");
	
	if (commandName == "donateAccept") {
		const modal = client.ModalHandler.get("donateAcceptModal");
		if (!modal) return;

		await interaction.showModal(modal.execute(args[0]));
	}

	if (commandName == "donateReject") {
		odrzuc(client, interaction, parseInt(args[0]));
	}
};
