import { EmbedFieldData, HexColorString, MessageEmbed, User } from "discord.js"

export interface EmbedStructure {
	title?: string
	description?: string
	color?: HexColorString
	fields?: EmbedFieldData[]
	footer?: boolean
	user: User
}

export const Embed = ({
	title,
	description,
	color,
	fields,
	footer = true,
	user,
}: EmbedStructure): MessageEmbed => {
	const embed = new MessageEmbed()

	if (title) embed.setTitle(title)
	if (color) embed.setColor(color)
	else embed.setColor("#fcbe03")
	if (description) embed.setDescription(description)
	if (fields) embed.addFields(fields)
	if (footer)
		embed
			.setFooter({ text: `${user.tag} (${user.id})` })
			.setTimestamp(new Date())

	return embed
}
