import { Interaction, InteractionReplyOptions } from "discord.js";
import { RDMBot } from "main";
import { EmbedBuilder as EB, ErrorEmbedInteraction } from "utils/embedBuilder";
import handleCommands from "./events/commands";
import handleAutocomplete from "./events/autocomplete";
import handleButton from "./events/button";
import handleModalSubmit from "./events/modalSubmit";

declare module "discord.js" {
    interface BaseInteraction {
        hasReplied: boolean;
        Reply: (content: string | EB[], options?: InteractionReplyOptions) => Promise<Message<boolean> | InteractionResponse<boolean> | undefined>;
        Error: (content: string, options?: InteractionReplyOptions) => Promise<Message<boolean> | InteractionResponse<boolean> | undefined>;
    }
}

export const handleInteraction = async (interaction: Interaction, client: RDMBot) => {
    if (!interaction.inGuild()) return;
    if (interaction.guildId != client.config.discord.mainGuild) return;

    interaction.Reply = async (content: string | EB[], options?: InteractionReplyOptions) => {
        if (!interaction.isRepliable()) return undefined;

        let messageObject = {};

        if (typeof content == "string")
            messageObject = Object.assign(options || {}, { content });
        else if (content[0] instanceof EB)
            messageObject = Object.assign(options || {}, { embeds: content });

        if (interaction.hasReplied) {
            return interaction.deferReply(messageObject);
        } else {
            interaction.hasReplied = true;
            return interaction.reply(messageObject);
        }
    };

    interaction.Error = (content: string, options?: InteractionReplyOptions) => {
        return interaction.Reply([ ErrorEmbedInteraction(interaction, content as string) ], options);
    };

    await handleModalSubmit(client, interaction);
    await handleButton(client, interaction);
    await handleCommands(client, interaction);
    await handleAutocomplete(client, interaction);
};