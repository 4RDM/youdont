import { User } from "discord.js";
import { CommandArgs } from "../../../../types";
import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";

export const execute = async function({ client, message, args }: CommandArgs) {
	if (!args[0] || !args[1]) return message.channel.send({
		embeds: [ErrorEmbed(message, "Nie wprowadzono ID wpłaty bądź powodu odrzucenia")],
	});

	const donate = await client.Core.database.donates.get(parseInt(args[0]));
	if (!donate) return message.channel.send({
		embeds: [ErrorEmbed(message, "Nie znaleziono zarejestrowanej wpłaty o takim ID")]
	});

	if (donate.approved) return message.channel.send({
		embeds: [ErrorEmbed(message, "Wpłata została wcześniej zaakceptowana")]
	});

	args.shift();

	(await client.users.createDM(donate.userID)).send({
		embeds: [Embed({
			title: ":x: | Wpłata na serwer",
			description: "Twoja wpłata została odrzucona przez administratora",
			fields: [
				{
					name: "Administrator",
					value: `\`${message.author.tag} (${message.author.id})\``,
				},
				{
					name: "ID wpłaty",
					value: `\`${donate.dID?.toString()}\``,
				},
				{
					name: "Powód",
					value: `\`${args.join(" ")}\``
				}
			],
			color: "#f54242",
			footer: false,
			user: <User>client.user
		})]
	});

	message.channel.send({
		embeds: [Embed({
			title: ":x: | Odrzucono wpłatę",
			color: "#f54242",
			description: `Odrzucono wpłatę o ID \`${donate.dID}\``,
			user: message.author,
		})]
	});
};

export const info = {
	triggers: ["odrzuc"],
	description: "Odrzuć donate o danym ID",
	permissions: ["ADMINISTRATOR"],
};