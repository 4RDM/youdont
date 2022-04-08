import logger from "../../../../utils/logger";
import { ErrorEmbed } from "../../../../utils/discordEmbed";
import { CommandArgs } from "../../../../types";

export const execute = async function({ client, message, args }: CommandArgs) {
	const role = message.mentions.roles.first();
	if (!role) return message.channel.send({
		embeds: [ErrorEmbed(message, "Nie spingowano roli, którą mam nadać po weryfikacji!")]
	});

	const msg = await message.channel.send({ content: "Zweryfikuj się naciskając emoji pod wiadomością! Weryfikując się akceptujesz <#843484880116514830>" });
	await msg.react("❤️");

	client.Core.database.settings.set("verificationChannel", message.channel.id);
	client.Core.database.settings.set("verificationRole", role.id);
	logger.log("Verification is set!");
};

export const info = {
	triggers: ["setupver"],
	description: "Stwórz wiadomość do weryfikacji",
	permissions: ["ADMINISTRATOR"]
};