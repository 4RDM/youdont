import { CommandArgs } from "../../../../types";

export const execute = async function({ client, message }: CommandArgs) {
	const document = await client.Core.database.donates.create({
		userID: message.author.id,
		timestamp: new Date(),
		type: "paypal",
	});
	message.reply(`OKEY, done in ${Date.now() - message.createdTimestamp}ms\n\`\`\`${JSON.stringify(document)}\`\`\``);
};

export const info = {
	triggers: ["testwplata"],
	description: "Zaakceptuj donate o danym ID",
	permissions: ["ADMINISTRATOR"]
};