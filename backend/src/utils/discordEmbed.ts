import {
	EmbedAuthorData,
	EmbedField,
	HexColorString,
	Message,
	EmbedBuilder,
	User,
	CommandInteraction,
} from "discord.js";

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
}: EmbedStructure): EmbedBuilder => {
	const embed = new EmbedBuilder();

	if (author) embed.setAuthor(author);
	if (title) embed.setTitle(title);
	if (color) embed.setColor(color);
	else embed.setColor("#fcbe03");
	if (description) embed.setDescription(description);
	if (fields) embed.addFields(fields);
	if (footer) embed.setFooter({ text: footer }).setTimestamp(new Date());
	if (timestamp) embed.setTimestamp(timestamp);
	else if (user)
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

export const ErrorEmbedInteraction = (
	interaction: CommandInteraction,
	reason: string
) =>
	Embed({
		title: "Błąd",
		description: `**${reason}**`,
		color: "#f54242",
		user: interaction.user,
	});
