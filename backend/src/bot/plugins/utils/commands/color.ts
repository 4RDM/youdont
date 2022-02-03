import { Embed } from "../../../../utils/discordEmbed"
import { Command } from "../../../../types"
import { MessageAttachment } from "discord.js"
import Jimp from "jimp"

const test = /(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/gi

const command: Command = {
	triggers: ["color"],
	description: "Wygeneruj obraz z koloru",
	async exec(client, message, args) {
		const color = args.join("").replace(/ /gm, "").match(test)

		if (color == null)
			return message.channel.send({
				embeds: [
					Embed({
						color: "#E74C3C",
						title: "Błąd składni polecenia",
						description:
							"```Brakuje parametru 'color',\nPrawidłowe użycie: .color #000000```",
						user: message.author,
					}),
				],
			})

		// prettier-ignore
		const image = await new Jimp(100, 100, args.join("").split(" ").join("")).getBase64Async(Jimp.MIME_JPEG)
		const stream = Buffer.from(image.split(",")[1], "base64")
		const attachment = new MessageAttachment(stream, "color.png")

		message.channel.send({ files: [attachment] })
	},
}

module.exports = command
