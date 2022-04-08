import { CommandArgs } from "../../../../types";
import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";
import { User, WebhookClient } from "discord.js";

export const execute = async function({ client, message, args }: CommandArgs) {
	if (!args[0] || !args[1]) return message.channel.send({
		embeds: [ErrorEmbed(message, "Prawidłowe użycie: `.zaakceptuj <ID> <kwota>`")],
	});

	const donate = await client.Core.database.donates.get(parseInt(args[0]));

	if (donate && donate.dID && !donate.approved) {
		const don = await client.Core.database.donates.approve(donate.dID, message.author.tag, args[1]);

		if (!don) return;

		message.channel.send({
			embeds: [Embed({
				title: "Zaakceptowano wpłatę",
				description: `Zaakceptowano wpłatę o ID: \`${args[0]}\`, na kwotę: \`${args[1]}\``,
				color: "#1F8B4C",
				user: message.author,
			})],
		});

		const dmUser = await client.users.createDM(donate.userID);
		const dbUser = await client.Core.database.users.approve(donate.userID, don); 
		const user = await client.users.fetch(dbUser?.userID || "");
		const webhook =  new WebhookClient({ url: client.Core.database.settings.settings.donateWebhook });
		
		webhook.send({
			embeds: [
				Embed({
					title: "Nowa dotacja",
					description: `Dziękujemy **${user.tag}** za wpłatę \`${parseInt(args[1])}zł\` na serwer :heart::heart:\nChcesz zostać donatorem? <#843444742981156896> i napisz do mnie na PW \`donate\` ([Jak wysłać donate](https://4rdm.pl/article-wplata-na-serwer))`,
					thumbnail: user.displayAvatarURL(),
					color: "#ffffff",
					user: <User>client.user 
				})
			]
		});

		dmUser.send({
			embeds: [
				Embed({
					title: "Donate",
					description: `Twoja wpłata o ID \`${donate.dID}\` została zaakceptowana przez \`${message.author.tag}\`. Suma wpłaconych donate: \`${dbUser?.total || 0}zł\`\nWyślij swój hex na kanał: <#843488362262167594> ([Jak zdobyć hexa](https://4rdm.pl/article-skad-zdobyc-hexa))`,
					color: "#1F8B4C",
					user: message.author,
				})
			],
		});
	} else if (donate && donate.approved) {
		message.channel.send({
			embeds: [ErrorEmbed(message, "Wpłata została już zaakceptowana")],
		});
	} else {
		message.channel.send({
			embeds: [ErrorEmbed(message, "Nie znaleziono donate")],
		});
	}
};

export const info = {
	triggers: ["zaakceptuj"],
	description: "Zaakceptuj donate o danym ID",
	permissions: ["ADMINISTRATOR"],
};