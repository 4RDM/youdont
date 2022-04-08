import { Embed } from "../../../../utils/discordEmbed";
import { CommandArgs } from "../../../../types";
import { MessageAttachment } from "discord.js";
import Jimp from "jimp";

const test = /(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/gi;

export const execute = async function({ message, args }: CommandArgs) {
	const color = args.join("").replace(/ /gm, "").match(test);
	if (color == null)return message.channel.send({
		embeds: [
			Embed({
				color: "#E74C3C",
				title: "Błąd składni polecenia",
				description:
					"```Brakuje parametru 'color',\nPrawidłowe użycie: .color #000000```",
				user: message.author,
			}),
		],
	});

	const image = await new Jimp(100, 100, args.join("").split(" ").join("")).getBase64Async(Jimp.MIME_JPEG);
	const stream = Buffer.from(image.split(",")[1], "base64");
	const attachment = new MessageAttachment(stream, "color.png");

	message.channel.send({ files: [attachment] });
};

export const info = {
	triggers: ["color"],
	description: "Wygeneruj obraz z koloru",
};