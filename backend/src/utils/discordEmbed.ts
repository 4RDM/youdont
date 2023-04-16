import {
	EmbedAuthorData,
	EmbedFieldData,
	HexColorString,
	Message,
	MessageEmbed,
	User,
} from "discord.js";

export interface EmbedStructure {
	title?: string;
	description?: string;
	color?: HexColorString;
	fields?: EmbedFieldData[];
	footer?: boolean;
	thumbnail?: string;
	image?: string;
	user: User;
	author?: EmbedAuthorData;
}

export const Embed = ({
	title,
	description,
	color,
	fields,
	footer = true,
	thumbnail,
	image,
	user,
	author,
}: EmbedStructure): MessageEmbed => {
	const embed = new MessageEmbed();

	if (author) embed.setAuthor(author);
	if (title) embed.setTitle(title);
	if (color) embed.setColor(color);
	else embed.setColor("#fcbe03");
	if (description) embed.setDescription(description);
	if (fields) embed.addFields(fields);
	if (footer)
		embed
			.setFooter({ text: `${user.tag} (${user.id})` })
			.setTimestamp(new Date());
	if (image) embed.setImage(image);
	if (thumbnail) embed.setThumbnail(thumbnail);

	return embed;
};

export const ErrorEmbed = (message: Message, reason: string) =>
	Embed({
		title: "Błąd",
		description: `${message.content
			.split("\n")
			.map((x: string) => `> ${x}`)
			.join("\n")}\n\n**${reason}**`,
		color: "#f54242",
		user: message.author,
	});
