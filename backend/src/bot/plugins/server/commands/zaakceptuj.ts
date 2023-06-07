import {
	Interaction,
	SlashCommandBuilder,
	User,
	WebhookClient,
} from "discord.js";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";
import logger from "../../../../utils/logger";

export interface Benefit {
	amount: number;
	roleID: string;
	name: "Użytkownik" | "Donator" | "Donator+" | "Partner" | "Partner+";
}

export const benefits: Benefit[] = [
	{
		name: "Użytkownik",
		roleID: "843476029226221609",
		amount: 0,
	},
	{
		name: "Donator",
		roleID: "843444653042302996",
		amount: 5,
	},
	{
		name: "Donator+",
		roleID: "843444652412633098",
		amount: 20,
	},
	{
		name: "Partner",
		roleID: "843444651704844318",
		amount: 50,
	},
	{
		name: "Partner+",
		roleID: "843444650881581076",
		amount: 100,
	},
];

const findClosest = (value: number): Benefit =>
	benefits.reduce((a, b) => {
		if (a.amount === value) return a;
		if (b.amount === value) return b;
		if (Math.abs(b.amount - value) <= Math.abs(a.amount - value)) {
			return b.amount <= value ? b : a;
		}

		return a;
	});

// prettier-ignore
export async function accept(client: CommandArgs["client"], interaction: Interaction, id: number, amount: number) {
	if (!interaction.isButton() && !interaction.isCommand() && !interaction.isModalSubmit()) return;

	const donate = await client.Core.database.donates.get(id);

	if (donate && !donate.approved) {
		const don = await client.Core.database.donates.approve(donate.id, amount, interaction.user.id);

		if (!don) return;

		interaction.reply({
			content: don.discordID,
			embeds: [
				Embed({
					title: "Zaakceptowano wpłatę",
					description: `Zaakceptowano wpłatę o ID: \`${id}\`, na kwotę: \`${amount}zł\`, Osoba dokonująca płatność: \`${interaction.user.id}\``,
					color: "#1F8B4C",
					user: interaction.user,
				}),
			],
		});

		const dmUser = await client.users.createDM(donate.discordID);
		const fetchedUser = await client.Core.database.users.get(donate.discordID);

		const user = await client.users.fetch(fetchedUser?.discordID || "");
		const webhook = new WebhookClient({ url: client.config.donateWebhook });

		if (!user)
			return interaction.followUp({
				embeds: [
					Embed({
						title: "Nieznaleziono użytkownika",
						color: "#f54242",
						user: interaction.user,
					}),
				],
			});

		try {
			await client.guilds.cache
				.get(client.Core.bot.config.discord.mainGuild)
				?.members.cache.get(user.id)
				?.roles.add(findClosest(fetchedUser?.total || 0).roleID);
		} catch (err) {
			logger.error(`[zaakceptuj.ts]: ${(err as Error).stack}`);
			interaction.reply({
				embeds: [
					ErrorEmbedInteraction(
						interaction,
						`An error occurred while adding role: \`${err}\`, check console for more details!`
					),
				],
			});
		}

		webhook.send({
			embeds: [
				Embed({
					title: "Nowa dotacja",
					description: `Dziękujemy **${user.tag}** na serwer :heart::heart:\nChcesz zostać donatorem? <#843444742981156896> i napisz do mnie na PW \`donate\` ([Jak wysłać donate](https://4rdm.pl/article-wplata-na-serwer))`,
					thumbnail: user.displayAvatarURL(),
					color: "#ffffff",
					user: <User>client.user,
				}),
			],
		});

		dmUser.send({
			embeds: [
				Embed({
					title: "Donate",
					description: `Twoja wpłata o ID \`${
						donate.id
					}\` została zaakceptowana przez \`${
						interaction.user.tag
					}\`. Suma wpłaconych donate: \`${
						fetchedUser?.total || 0
					}zł\`\nWyślij swój hex na kanał: <#843488362262167594> ([Jak zdobyć hexa](https://4rdm.pl/article-skad-zdobyc-hexa))`,
					color: "#1F8B4C",
					user: interaction.user,
				}),
			],
		});
	} else if (donate && donate.approved) {
		interaction.reply({
			embeds: [
				ErrorEmbedInteraction(
					interaction,
					"Wpłata została już zaakceptowana"
				),
			],
		});
	} else {
		interaction.reply({
			embeds: [
				ErrorEmbedInteraction(interaction, "Nie znaleziono donate"),
			],
		});
	}
}

// prettier-ignore
export default async function ({ client, interaction }: CommandArgs) {
	if (!interaction.isChatInputCommand()) return;

	const id = interaction.options.getInteger("id", true);
	const amount = interaction.options.getInteger("kwota", true);
	
	await accept(client, interaction, id, amount);
}

export const info: CommandInfo = {
	triggers: ["zaakceptuj"],
	description: "Zaakceptuj donate o danym ID",
	permissions: ["Administrator"],
	builder: new SlashCommandBuilder()
		.addIntegerOption(option =>
			option.setName("id").setDescription("ID donate").setRequired(true)
		)
		.addIntegerOption(option =>
			option
				.setName("kwota")
				.setDescription("Kwota donate")
				.setRequired(true)
		)
		.setName("zaakceptuj"),
};
