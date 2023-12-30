import {
    EmbedAuthorData,
    EmbedField,
    HexColorString,
    Message,
    EmbedBuilder as _EmbedBuilder,
    User,
    CommandInteraction,
    Interaction,
    BaseInteraction,
} from "discord.js";
import { emojis } from "./emojis";
import { embedColors as _color } from "./constants";

export interface EmbedStructure {
    title?: string;
    description?: string;
    color?: HexColorString;
    fields?: EmbedField[];
    footer?: string;
    thumbnail?: string;
    image?: string;
    user?: User;
    author?: EmbedAuthorData;
    timestamp?: Date;
    icon?: string;
}

export class EmbedBuilder extends _EmbedBuilder {
    constructor() {
        super();
    }

    setIcon(icon: string) {
        return this.setThumbnail(icon);
        // return this.setTitle(`${icon} | ${this.data.title}`);
    }
}

export const Embed = ({
    title,
    description,
    color,
    fields,
    footer,
    thumbnail,
    image,
    user,
    author,
    timestamp,
    icon,
}: EmbedStructure): EmbedBuilder => {
    const embed = new EmbedBuilder();

    if (author) embed.setAuthor(author);
    if (title) embed.setTitle(title + (process.env.NODE_ENV !== "production" ? " (dev)" : ""));
    if (color) embed.setColor(color);
    else embed.setColor(_color.purple);
    if (description) embed.setDescription(description);
    if (fields) embed.addFields(fields);
    if (footer) embed.setFooter({ text: footer }).setTimestamp(new Date());
    if (timestamp) embed.setTimestamp(timestamp);
    else if (user)
        embed
            .setFooter({ text: `${user.tag} (${user.id})` })
            .setTimestamp(new Date());
    if (image && image.replace(/[ \n\t]/gm, "") !== "") embed.setImage(image);
    if (thumbnail && thumbnail.replace(/[ \n\t]/gm, "") !== "") embed.setThumbnail(thumbnail);
    if (icon) embed.setIcon(icon);

    return embed;
};

export const ErrorEmbed = (object: Message | Interaction, reason: string) => {
    if (object instanceof Message)
        return ErrorEmbedMessage(object, reason);
    if (object instanceof BaseInteraction)
        return ErrorEmbedInteraction(object, reason);
};

export const ErrorEmbedMessage = (message: Message, reason: string) =>
    Embed({
        title: "Błąd",
        description: `${message.content
            .split("\n")
            .map((x: string) => `> ${x}`)
            .join("\n")}\n\n**${reason}**`,
        color: _color.red,
        user: message.author,
    }).setIcon(emojis.errorGenericURL);

export const ErrorEmbedInteraction = (
    interaction: Interaction | CommandInteraction,
    reason: string
) =>
    Embed({
        title: "Błąd",
        description: `${reason}`,
        color: _color.red,
        user: interaction.user,
    }).setIcon(emojis.errorGenericURL);
