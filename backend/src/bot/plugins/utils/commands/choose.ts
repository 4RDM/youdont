import { Command } from "../../../../types";

const command: Command = {
	triggers: ["choose"],
	description: "Wybiera losową wiadomość",
	async exec(client, message, args) {
		const tochoose = args
			.join(" ")
			.split(" ")
			.filter(val => val !== "")
			.join(" ")
			.split(",")
			.map(val => val.replace(/^([^\s]*)\s/gm, ""));
		if (tochoose.length >= 2) {
			const random = Math.floor(Math.random() * tochoose.length);
			message.channel.send({ content: tochoose[random] });
		}
	},
};

module.exports = command;
