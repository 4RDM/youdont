import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";
import { getUserHex } from "./hex";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

const path = join(
	// __dirname,
	// "vehicles.json"
	"/home/rdm/server/data/resources/[Nimplex]/4rdm/data/auta/shared.json"
);

export const awaitMessage = (
	interaction: CommandInteraction
): Promise<string> => {
	const promise = new Promise<string>((resolve, reject) => {
		interaction.channel
			?.awaitMessages({
				filter: msg => msg.author.id === interaction.user.id,
				max: 1,
				time: 60000,
				errors: ["time"],
			})
			.then(collected => {
				if (!collected || !collected.first())
					return reject("Nie wprowadzono odpowiedzi");

				resolve(collected.first()?.content || "");
			})
			.catch(() => {
				reject("Nie wprowadzono odpowiedzi");
			});
	});

	return promise;
};

// prettier-ignore
export default async function ({ client, interaction }: CommandArgs) {
	if (!existsSync(path))
		return interaction.reply({ embeds: [ErrorEmbedInteraction(interaction, "Funkcja niedostępna na tym komputerze!")] });

	if (!interaction.isChatInputCommand()) return;

	const subcommand = interaction.options.getSubcommand();
	const userJson = (await import(path)).default;
	let reply;

	if (subcommand === "dodaj") {
		const mention = interaction.options.getUser("mention", true);
		const spawnName = interaction.options.getString("spawn-name", true);
		const displayName = interaction.options.getString("display-name", true);
		const userHexes = await getUserHex(client, mention.id);
		let currentHex;

		if (!userHexes)
			return interaction.reply({
				embeds: [ErrorEmbedInteraction(interaction, "Wystąpił błąd bazy danych")],
			});

		if (!userHexes[0])
			return interaction.reply({
				embeds: [ErrorEmbedInteraction(interaction, "Nie znaleziono gracza!")],
			});
		
		if (userHexes.length > 1) {
			const identifiers: { identifier: string }[] = userHexes;
			let awaitedMessage;

			reply = interaction.reply(`\`\`\`Znalezione identyfikatory:\n${identifiers.map((x, i: number) => `${i + 1}. ${x.identifier}`).join("\n")}\`\`\`\nKtóry z nich użyć?`);
		
			try {
				awaitedMessage = await awaitMessage(interaction);
			} catch (e) {
				return interaction.reply({
					embeds: [ErrorEmbedInteraction(interaction, "Nie wprowadzono odpowiedzi")],
				});
			}

			let index = parseInt(awaitedMessage);

			if (isNaN(index))
				return interaction.reply({ embeds: [ErrorEmbedInteraction(interaction, "Wprowadzono błędny index, nie jest cyfrą!")] });

			currentHex = identifiers[--index]?.identifier;

			if (!currentHex)
				return interaction.reply({
					embeds: [ErrorEmbedInteraction(interaction, "Wybrano błędny hex!")],
				});
		} else {
			currentHex = userHexes[0].identifier;
		}

		if (!userJson[currentHex]) userJson[currentHex] = [];
		userJson[currentHex].push([spawnName, displayName]);

		writeFileSync(path, JSON.stringify(userJson), { encoding: "utf-8" });

		const embed = Embed({
			title: ":white_check_mark: | Dodano auto współdzielone!",
			color: "#1F8B4C",
			author: {
				name: mention.tag,
				iconURL: mention.displayAvatarURL(),
			},
			description: `**Hex**: \`${currentHex}\`\n**Spawn name**: \`${spawnName}\`\n**Display name**: \`${displayName}\``,
			user: interaction.user,
		});

		if (reply) interaction.followUp({ embeds: [embed] });
		else interaction.reply({ embeds: [embed] });
	} else if (subcommand === "usun") {
		const mention = interaction.options.getUser("mention", true);
		const spawnName = interaction.options.getString("spawn-name", true);
		const userHexes = await getUserHex(client, mention.id);
		let currentHex;

		if (!userHexes)
			return interaction.reply({
				embeds: [ErrorEmbedInteraction(interaction, "Wystąpił błąd bazy danych")],
			});

		if (!userHexes[0])
			return interaction.reply({
				embeds: [ErrorEmbedInteraction(interaction, "Nie znaleziono gracza!")],
			});
		
		if (userHexes.length > 1) {
			const identifiers: { identifier: string }[] = userHexes;
			let awaitedMessage;

			reply = interaction.reply(`\`\`\`Znalezione identyfikatory:\n${identifiers.map((x, i: number) => `${i + 1}. ${x.identifier}`).join("\n")}\`\`\`\nKtóry z nich użyć?`);
		
			try {
				awaitedMessage = await awaitMessage(interaction);
			} catch (e) {
				return interaction.reply({
					embeds: [ErrorEmbedInteraction(interaction, "Nie wprowadzono odpowiedzi")],
				});
			}

			let index = parseInt(awaitedMessage);

			if (isNaN(index))
				return interaction.reply({ embeds: [ErrorEmbedInteraction(interaction, "Wprowadzono błędny index, nie jest cyfrą!")] });

			currentHex = identifiers[--index]?.identifier;

			if (!currentHex)
				return interaction.reply({
					embeds: [ErrorEmbedInteraction(interaction, "Wybrano błędny hex!")],
				});
		} else {
			currentHex = userHexes[0].identifier;
		}

		const index = userJson[currentHex].findIndex((x: string[]) => x[0] == spawnName);
		if (index == -1) {
			const embed = ErrorEmbedInteraction(interaction, `Nie znaleziono aut współdzielonych o nazwie \`${spawnName}\`!`);

			if (reply) return interaction.followUp({ embeds: [embed] });
			else return interaction.reply({ embeds: [embed] });
		}

		userJson[currentHex].splice(index, 1);

		writeFileSync(path, JSON.stringify(userJson), { encoding: "utf-8" });

		const embed = Embed({
			title: ":x: | Usunięto auto współdzielone!",
			color: "#f54242",
			author: {
				name: mention.tag,
				iconURL: mention.displayAvatarURL(),
			},
			description: `**Hex**: \`${currentHex}\`\n**Spawn name**: \`${spawnName}\``,
			user: interaction.user,
		});

		if (reply) interaction.followUp({ embeds: [embed] });
		else interaction.reply({ embeds: [embed] });
	} else if (subcommand === "lista") {
		const mention = interaction.options.getUser("mention", true);

		const userHexes = await getUserHex(client, mention.id);

		if (!userHexes)
			return interaction.reply({
				embeds: [ErrorEmbedInteraction(interaction, "Wystąpił błąd bazy danych")],
			});

		if (!userHexes[0])
			return interaction.reply({
				embeds: [ErrorEmbedInteraction(interaction, "Nie znaleziono gracza!")],
			});

		const limitki: { [key: string]: string[][] } = {};
		const description: string[] = [];

		userHexes.forEach((x) => {
			limitki[x.identifier] = userJson[x.identifier];
		});

		Array.from(Object.keys(limitki)).forEach((hex) => {
			if (limitki[hex]) {
				description.push(`**${hex}**:`);
				limitki[hex].forEach((limitka: string[]) => {
					description.push(`\`${limitka[0]}\`: \`${limitka[1]}\``);
				});
			}
		});

		interaction.reply({
			embeds: [
				Embed({
					author: {
						name: mention.username,
						iconURL: mention.displayAvatarURL(),
					},
					user: interaction.user,
					title: "Auta współdzielone użytkownika",
					description: description.join("\n"),
				}),
			],
		});
	}
}

export const info: CommandInfo = {
	triggers: ["shared"],
	description: "Zarządzanie autami współdzielonymi graczy",
	permissions: ["Administrator"],
	role: "843444626726584370", // ZARZĄD
	builder: new SlashCommandBuilder()
		.addSubcommand(subcommand =>
			subcommand
				.setName("dodaj")
				.setDescription("Dodaje współdzielone auto")
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
				.setDescription("Usuwa współdzielone auto")
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
		.setName("shared"),
};
