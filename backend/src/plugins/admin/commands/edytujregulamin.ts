import {
    ChannelType,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { Embed } from "utils/embedBuilder";
import { Roles, embedColors } from "utils/constants";

export default async function ({ interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;

    const channel = interaction.options.getChannel<ChannelType.GuildText>("channel", true);
    const message = interaction.options.getString("message", true);

    const fetchedMessage = await channel.messages.fetch(message).catch();

    if (!fetchedMessage)
        return await interaction.Error("Nieznaleziono wiadomości");

    interaction.Reply([
        Embed({
            title: ":hourglass: | Wprowadź wiadomość",
            user: interaction.user,
        }),
    ]);

    await interaction.channel?.awaitMessages({
        filter: msg => msg.author.id === interaction.user.id,
        max: 1,
        time: 60000,
        errors: [ "time" ],
    })
        .then(collectedMessages => {
            if (!collectedMessages.first()?.content)
                return interaction.Error("Niewprowadzono wiadomości!");

            fetchedMessage
                .edit({
                    embeds: [
                        Embed({
                            title: "Regulamin serwera 4RDM",
                            color: embedColors.purple,
                            description: collectedMessages.first()?.content,
                            footer: `© 2020-${new Date().getUTCFullYear()}`,
                        }),
                    ],
                })
                .catch(err => {
                    interaction.Error(err);
                });
        })
        .catch(() => {
            interaction.Error("Niewprowadzono wiadomości!");
        });
}

export const info: CommandInfoType = {
    name: "edytujregulamin",
    description: "Edytuje regulamin",
    permissions: PermissionFlagsBits.Administrator,
    role: [ Roles.Owner ],
    builder: new SlashCommandBuilder()
        .addChannelOption(option => option.addChannelTypes(ChannelType.GuildText).setName("channel").setDescription("Kanał, w którym znajduje się wiadomość").setRequired(true))
        .addStringOption(option => option.setName("message").setDescription("ID wiadomości").setRequired(true))
        .setName("edytujregulamin"),
};
