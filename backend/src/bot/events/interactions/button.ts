import { ButtonInteraction } from "discord.js";
import { Client } from "../../main";
import { odrzuc } from "../../plugins/server/commands/odrzuc";
import { Embed, ErrorEmbedInteraction } from "../../../utils/discordEmbed";
import { getBan } from "./modalSubmit";

export const handleButtonInteraction = async (client: Client, interaction: ButtonInteraction) => {
    if (!interaction.isButton()) return;

    const [commandName, ...args] = interaction.customId.split("_");

    if (commandName == "open-mute-form") {
        // const modal = client.modalHandler.get("donateAcceptModal");
    }

    if (commandName == "unbanButton") {
        const banID = args[1];
        const ban = getBan(banID);

        if (!ban)
            return interaction.Reply({ content: "Ban nie istnieje (prawdopodobnie się przedawnił)", ephemeral: true });

        if (args[0] == "accept") {
            await client.core.database.playerData.acceptUnban(banID);
            await interaction.message.edit({ embeds: interaction.message.embeds, components: [] });
            await interaction.Reply({
                embeds: [
                    Embed({
                        title: "Odwołanie zostało zaakceptowane!",
                        color: "#1F8B4C",
                        user: interaction.user,
                    }),
                ]
            });
        } else if (args[0] == "deny") {
            const res = await client.core.database.playerData.denyUnban(banID);

            if (!res)
                return await interaction.Reply({ content: "Wystąpił błąd bazy danych!", ephemeral: true });

            await interaction.message.edit({ embeds: interaction.message.embeds, components: [] });

            await interaction.Reply({
                content: res[0] >= 3 ? "<@&843444626726584370> odwołanie zostało odrzucone >= 3 razy!" : "",
                embeds: [
                    Embed({
                        title: "Odwołanie zostało odrzucone!",
                        color: "#1F8B4C",
                        user: interaction.user,
                    }),
                ]
            });
        } else if (args[0] == "shorten") {
            await client.core.database.playerData.acceptUnban(banID);

            await interaction.message.edit({ embeds: interaction.message.embeds, components: [] });
        }
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
