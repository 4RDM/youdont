import {
	Interaction,
	SlashCommandBuilder,
	User,
	WebhookClient,
} from "discord.js";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";
import logger from "../../../../utils/logger";
import { getUserHex } from "./hex";
import { addFile } from "../../../../utils/filesystem";
import { hexToDec } from "../../../../utils/strings";
import { join } from "path";

export interface Benefit {
	amount: number;
	roleID: string;
	fivem: string;
	name: "Użytkownik" | "Donator" | "Donator+" | "Partner" | "Partner+";
}

export const benefits: Benefit[] = [
	{
		name: "Użytkownik",
		fivem: "",
		roleID: "843476029226221609",
		amount: 0,
	},
	{
		name: "Donator",
		fivem: "donator",
		roleID: "843444653042302996",
		amount: 5,
	},
	{
		name: "Donator+",
		fivem: "donatorplus",
		roleID: "843444652412633098",
		amount: 20,
	},
	{
		name: "Partner",
		fivem: "partner",
		roleID: "843444651704844318",
		amount: 70,
	},
	{
		name: "Partner+",
		fivem: "partnerplus",
		roleID: "843444650881581076",
		amount: 120,
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

const path = join("/home/rdm/server/data/permisje.cfg");

// prettier-ignore
export async function accept(client: CommandArgs["client"], interaction: Interaction, id: number, amount: number) {
	if (!interaction.isButton() && !interaction.isCommand() && !interaction.isModalSubmit()) return;

	const donate = await client.core.database.donates.get(id);

	if (donate && !donate.approved) {
		const don = await client.core.database.donates.approve(donate.id, amount, interaction.user.id);

		if (!don) return;

		interaction.Reply({
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
		const fetchedUser = await client.core.database.users.get(donate.discordID);

		const user = await client.users.fetch(fetchedUser?.discordID || "");
		const webhook = new WebhookClient({ url: client.config.donateWebhook });

		if (!user)
			return interaction.Reply({
				embeds: [
					Embed({
						title: "Nieznaleziono użytkownika",
						color: "#f54242",
						user: interaction.user,
					}),
				],
			});

		try {
			if (!interaction.inGuild()) throw new Error("User is not in guild!");

			const guild = await client.guilds.fetch(interaction.guildId);

			if (!guild) throw new Error("Interaction guild not found!");

			const user = await guild.members.fetch(donate.discordID);

			if (!user) throw new Error("User not found!");

			const role = findClosest(fetchedUser?.total || 0);

			if (!role.fivem) return interaction.Reply({ embeds: [ErrorEmbedInteraction(interaction, "Nie można nadać roli na serwerze FiveM!")] });

			user.roles.add(role.roleID);

			const hexChannel = await guild.channels.fetch(client.config.discord.hexChannel);
			
			if (!hexChannel || !hexChannel.isTextBased()) throw new Error("Hex channel not found!");

			const hexes = await getUserHex(client, user.id);
			
			if (!hexes || !hexes[0]) return hexChannel.send(`<@${user.id}> nie posiada hexa!`);

			if (hexes.length > 1) return hexChannel.send(`<@${user.id}> posiada więcej niż jeden hex!\n\`\`\`${hexes.map(x => x?.identifier).join(",\n")}\`\`\``);

			const hex = hexes[0].identifier;

			const message = await hexChannel.send({
				embeds: [
					Embed({
						title: ":timer: | Hex",
						description: `\`${hex}\`: <@${user.id}> wysłano polecenie`,
						color: "#ffffff",
						user: interaction.user,
					}),
				],
			});

			addFile(`add_principal identifier.${hex} group.${role.fivem} # ${user.user.tag} (${user.id}) https://steamcommunity.com/profiles/${hexToDec(hex.replace("steam:", ""))} ${new Date().toLocaleDateString()}`, path)
				.then(() => {
					message.edit({
						embeds: [
							Embed({
								title: ":timer: | Hex",
								description: `\`${hex}\`: <@${user.id}> dodano!`,
								color: "#1F8B4C",
								user: interaction.user,
							}),
						],
					});

					client.core.rcon("exec permisje.cfg");
					client.core.rcon("refreshAllW0");
				})
				.catch(() => {
					message.edit({
						embeds: [ErrorEmbedInteraction(interaction, "Nie udało się wysłać polecenia")],
					});
				});
		} catch (err) {
			logger.error(`[zaakceptuj.ts]: ${(err as Error).stack}`);
			interaction.Reply({
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
					description: `Dziękujemy **${user.tag}** na serwer :heart::heart:\nChcesz zostać donatorem? <#843444742981156896> i napisz do mnie na PW \`donate\` ([Jak wysłać donate](https://4rdm.pl/articles/wplata-na-serwer))`,
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
					}zł\`\nWyślij swój hex na kanał: <#843488362262167594> ([Jak zdobyć hexa](https://4rdm.pl/articles/skad-zdobyc-hexa))`,
					color: "#1F8B4C",
					user: interaction.user,
				}),
			],
		});
	} else if (donate && donate.approved) {
		interaction.Reply({
			embeds: [
				ErrorEmbedInteraction(
					interaction,
					"Wpłata została już zaakceptowana"
				),
			],
		});
	} else {
		interaction.Reply({
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
