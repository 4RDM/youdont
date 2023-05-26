import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";
import { getUserHex } from "./hex";
import { awaitMessage } from "./shared";
import { SlashCommandBuilder } from "discord.js";

const path = join(
	// __dirname,
	// "vehicles.json"
	"/home/rdm/server/data/resources/[Nimplex]/4rdm/data/auta/vehicles.json"
);

export default async function ({ client, message, args }: CommandArgs) {
	const mention = message.mentions.members?.first();

	// prettier-ignore
	if (!existsSync(path))
		return message.channel.send({ embeds: [ErrorEmbed(message, "Funkcja niedostępna na tym komputerze!")] });

	// prettier-ignore
	if ((!mention && !args[0]) || (mention && mention.id != args[0]?.replace(/[<@>]/gm, "")))
		return message.channel.send({ embeds: [ErrorEmbed(message, "Nie wprowadzono ID użytkownika / nie spingowano")] });

	const userJson = (await import(path)).default;
	const userHexes = await getUserHex(client, mention?.id || args[0]);

	if (!userHexes)
		return message.channel.send({
			embeds: [ErrorEmbed(message, "Wystąpił błąd bazy danych")],
		});

	// prettier-ignore
	if (!userHexes[0])
		return message.channel.send({ embeds: [ErrorEmbed(message, "Nie znaleziono użytkownika")] });

	if (args.length == 1) {
		const limitki: { [key: string]: typeof userJson } = {};
		const description: string[] = [];
		let userIdentifiers = [];

		userHexes.forEach(x => {
			limitki[x.identifier] = userJson[x.identifier];
		});

		userIdentifiers = Object.keys(limitki);

		Array.from(userIdentifiers).forEach((hex: string) => {
			if (limitki[hex]) {
				description.push(`**${hex}**:`);

				limitki[hex].forEach((limitka: string[]) => {
					description.push(`\`${limitka[0]}\`: \`${limitka[1]}\``);
				});
			}
		});

		message.channel.send({
			embeds: [
				Embed({
					author: {
						name: mention?.nickname || mention?.user.tag || "Brak",
						iconURL: mention?.displayAvatarURL(),
					},
					user: message.author,
					title: "Limitki użytkownika",
					description: description.join("\n"),
				}),
			],
		});
	} else {
		// ======================
		// Get user hex
		// ======================

		const removeMode = args[1] && ["usun", "usuń"].includes(args[1]);

		// prettier-ignore
		if (!args[0] || !args[1] || (!removeMode && !args[2]))
			return message.channel.send({ embeds: [ErrorEmbed(message, "Prawidłowe użycie: `.limitka <@ping> <spawn/usun> <nazwa wyświetlana>`")] });

		let currentHex;
		const vehicleName = args.slice(2).join(" ") || "Brak";
		const respName = removeMode ? args[2] : args[1];

		if (userHexes.length > 1) {
			let awaitedMessage;

			// prettier-ignore
			message.channel.send(`\`\`\`Znalezione identyfikatory:\n${userHexes.map((x, i) => `${i + 1}. ${x.identifier}`).join("\n")}\`\`\`\nKtóry z nich użyć?`);

			try {
				awaitedMessage = await awaitMessage(message);
			} catch (e) {
				return message.channel.send({
					embeds: [ErrorEmbed(message, "Nie wprowadzono odpowiedzi")],
				});
			}

			let index = parseInt(awaitedMessage);

			// prettier-ignore
			if (isNaN(index)) 
				return message.channel.send({ embeds: [ErrorEmbed(message, "Wprowadzono błędny index, nie jest cyfrą!")] });

			currentHex = userHexes[--index]?.identifier;

			if (!currentHex)
				return message.channel.send({
					embeds: [ErrorEmbed(message, "Wybrano błędny hex!")],
				});
		} else {
			currentHex = userHexes[0].identifier;
		}

		if (removeMode) {
			// prettier-ignore
			const index = userJson[currentHex].findIndex((x: string[]) => x[0] == respName);

			// prettier-ignore
			if (index == -1)
				return message.channel.send({ embeds: [ErrorEmbed(message, `Nie znaleziono limitki o nazwie \`${respName}\`!`)] });

			userJson[currentHex].splice(index, 1);

			// prettier-ignore
			writeFileSync(path, JSON.stringify(userJson), { encoding: "utf-8" });

			return message.channel.send({
				embeds: [
					Embed({
						title: ":x: | Usunięto limitkę!",
						color: "#f54242",
						author: {
							name:
								mention?.nickname ||
								mention?.user.tag ||
								"Brak",
							iconURL: mention?.displayAvatarURL(),
						},
						description: `**Hex**: \`${currentHex}\`\n**Spawn name**: \`${respName}\``,
						user: message.author,
					}),
				],
			});
		}

		// ======================
		// Write vehicles to file
		// ======================
		if (!userJson[currentHex]) userJson[currentHex] = [];
		userJson[currentHex].push([respName, vehicleName]);

		writeFileSync(path, JSON.stringify(userJson), { encoding: "utf-8" });

		message.channel.send({
			embeds: [
				Embed({
					title: ":white_check_mark: | Dodano limitkę!",
					color: "#1F8B4C",
					author: {
						name: mention?.nickname || mention?.user.tag || "Brak",
						iconURL: mention?.displayAvatarURL(),
					},
					description: `**Hex**: \`${currentHex}\`\n**Spawn name**: \`${respName}\`\n**Display name**: \`${vehicleName}\``,
					user: message.author,
				}),
			],
		});
	}
}

export const info: CommandInfo = {
	triggers: ["limitki"],
	description: "Zarządzanie limitkami graczy",
	permissions: ["Administrator"],
	role: "843444626726584370", // ZARZĄD
	builder: new SlashCommandBuilder()
		.addSubcommand(subcommand =>
			subcommand
				.setName("dodaj")
				.setDescription("Dodaje limitkę")
				.addUserOption(option =>
					option
						.setName("mention")
						.setDescription("Użytkownik")
						.setRequired(true)
				)
				.addStringOption(option =>
					option
						.setName("spawn-name")
						.setDescription("Spawn name")
						.setRequired(true)
				)
				.addStringOption(option =>
					option
						.setName("display-name")
						.setDescription("Nazwa wyświetlana limitki")
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("usun")
				.setDescription("Usuwa limitkę")
				.addUserOption(option =>
					option
						.setName("mention")
						.setDescription("Użytkownik")
						.setRequired(true)
				)
				.addStringOption(option =>
					option
						.setName("spawn-name")
						.setDescription("Spawn name")
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("lista")
				.setDescription("Lista współdzielonych aut")
				.addUserOption(option =>
					option
						.setName("mention")
						.setDescription("Użytkownik")
						.setRequired(true)
				)
		)
		.setName("limitki"),
};

/*
.addStringOption(option =>
			option
				.setName("tryb")
				.setDescription("Tryb")
				.setRequired(true)
				.addChoices(
					{ name: "Dodaj", value: "dodaj" },
					{ name: "Usuń", value: "usun" }
				)
		)
		.addStringOption(option =>
			option
				.setName("nazwa")
				.setDescription("Nazwa limitki")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("nazwa wyświetlana")
				.setDescription("Nazwa wyświetlana limitki")
				.setRequired(false)
		)
		*/
