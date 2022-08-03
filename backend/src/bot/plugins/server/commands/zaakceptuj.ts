import { CommandArgs } from "../../../../types";
import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";
import logger from "../../../../utils/logger";
import { User, WebhookClient } from "discord.js";

export interface Benefit {
	amount: number
	roleID: string
	name: 'Użytkownik' | 'Donator' | 'Donator+' | 'Partner' | 'Partner+'
};

export const benefits: Benefit[] = [
	{
		name: 'Użytkownik',
		roleID: '843476029226221609',
		amount: 0,
	},
	{
		name: 'Donator',
		roleID: '843444653042302996',
		amount: 5,
	},
	{
		name: 'Donator+',
		roleID: '843444652412633098',
		amount: 20,
	},
	{
		name: 'Partner',
		roleID: '843444651704844318',
		amount: 50,
	},
	{
		name: 'Partner+',
		roleID: '843444650881581076',
		amount: 100,
	},
];

const findClosest = (value: number): Benefit => 
	benefits.reduce((a, b) => {
		if (a.amount === value) return a
		if (b.amount === value) return b
		if (Math.abs(b.amount - value) <= Math.abs(a.amount - value)) {
			return b.amount <= value ? b : a
		}

		return a
	});

export const execute = async function({ client, message, args }: CommandArgs) {
	if (!args[0] || !args[1]) return message.channel.send({
		embeds: [ErrorEmbed(message, "Prawidłowe użycie: `.zaakceptuj <ID> <kwota>`")],
	});

	const donate = await client.Core.database.donates.get(parseInt(args[0]));

	if (donate && donate.dID && !donate.approved) {
		const don = await client.Core.database.donates.approve(donate.dID, message.author.tag, args[1]);

		if (!don) return;

		message.channel.send({
			content: don.userID,
			embeds: [Embed({
				title: "Zaakceptowano wpłatę",
				description: `Zaakceptowano wpłatę o ID: \`${args[0]}\`, na kwotę: \`${args[1]}zł\``,
				color: "#1F8B4C",
				user: message.author,
			})],
		});

		const dmUser = await client.users.createDM(donate.userID);
		const dbUser = await client.Core.database.users.approve(donate.userID, don); 
		const user = await client.users.fetch(dbUser?.userID || "");
		const webhook =  new WebhookClient({ url: client.Core.database.settings.settings.donateWebhook });
		
		try {
			await client.guilds.cache.get("843444305149427713")?.members.cache.get(user.id)?.roles.add(findClosest(dbUser?.total || 0).roleID);
		} catch(err) {
			logger.error(`[zaakceptuj.ts]: ${(err as Error).stack}`);
			message.channel.send(`An error occurred while adding role: \`${err}\`, check console for more details!`);
		}

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