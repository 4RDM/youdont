import { ButtonInteraction } from "discord.js";
import { Client } from "../../main";
import { odrzuc } from "../../plugins/server/commands/odrzuc";
import { ErrorEmbedInteraction } from "../../../utils/discordEmbed";

export const handleButtonInteraction = async (client: Client, interaction: ButtonInteraction) => {
    if (!interaction.isButton()) return;

    const [commandName, ...args] = interaction.customId.split("_");

    if (commandName == "open-mute-form") {
        // const modal = client.modalHandler.get("donateAcceptModal");
    }

    if (commandName == "open-unban-form") {
        const modal = client.modalHandler.get("unbanFormModal");
        if (!modal) return interaction.Reply({ embeds: [ErrorEmbedInteraction(interaction, "Nie znaleziono modala")] });

        await interaction.showModal(modal.execute(interaction.user.id));
    }

    if (commandName == "donateAccept") {
        const modal = client.modalHandler.get("donateAcceptModal");
        if (!modal) return interaction.Reply({ embeds: [ErrorEmbedInteraction(interaction, "Nie znaleziono modala")] });

        await interaction.showModal(modal.execute(args[0]));
    }

    if (commandName == "donateReject") {
        odrzuc(client, interaction, parseInt(args[0]));
    }
};
