import { Interaction, InteractionReplyOptions } from "discord.js";
import { RDMBot } from "main";
import { EmbedBuilder as EB, ErrorEmbedInteraction } from "utils/embedBuilder";
import logger from "utils/logger";

interface _ReplyOptions extends InteractionReplyOptions {
    isError: boolean
}

declare module "discord.js" {
    interface BaseInteraction {
        hasReplied: boolean;
        Reply: (content: string | EB[], options?: _ReplyOptions) => Promise<Message<boolean> | InteractionResponse<boolean> | undefined>;
    }
}

export const handleInteraction = async (interaction: Interaction, client: RDMBot) => {
    if (!interaction.inGuild()) return;

    interaction.Reply = async (content: string | EB[], options?: _ReplyOptions) => {
        if (!interaction.isRepliable()) return undefined;

        let messageObject = {};

        if (typeof content == "string")
            messageObject = Object.assign(options || {}, { content });
        else if (content[0] instanceof EB)
            messageObject = Object.assign(options || {}, { embeds: content });

        if (interaction.hasReplied) {
            if (options?.isError)
                return interaction.Reply([ErrorEmbedInteraction(interaction, content as string)]);
            return interaction.deferReply(messageObject);
        } else {
            if (options?.isError)
                return interaction.Reply([ErrorEmbedInteraction(interaction, content as string)]);
            interaction.hasReplied = true;
            return interaction.reply(messageObject);
        }
    };

    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command)
            return await interaction.Reply("Command not found!", { isError: true });

        await command.execute({ client, interaction });
    }

    if (interaction.isAutocomplete()) {
        const command = client.commands.get(interaction.commandName);

        if (!command)
            return await interaction.Reply("Command not found!", { isError: true });

        if (!command.autocomplete)
            return logger.warn(`Autocompletion for ${command.info.name} not found!`);

        await command.autocomplete({ client, interaction });
    }
};