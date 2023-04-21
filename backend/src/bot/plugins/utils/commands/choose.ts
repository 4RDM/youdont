import { Command, CommandArgs } from "../../../../types";

export const execute = async function ({ message, args }: CommandArgs) {
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
};

export const info: Command["info"] = {
	triggers: ["choose"],
	description: "Wybiera losowy argument",
};
