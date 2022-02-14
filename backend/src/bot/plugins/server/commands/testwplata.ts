import { Command } from "../../../../types";

const command: Command = {
	triggers: ["testwplata"],
	description: "Zaakceptuj donate o danym ID",
	permissions: ["ADMINISTRATOR"],
	async exec(client, message, args) {
		const document = await client.Core.database.donates.create({
			userID: message.author.id,
			timestamp: new Date(),
			type: "paypal",
		});
		message.reply("Cool: " + document.dID);
	}
};

module.exports = command;