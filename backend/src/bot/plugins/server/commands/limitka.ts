import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";
import { CommandArgs } from "../../../../types";
import { getUserHex } from "./hex";

const path = join(
	"/home/rdm/server/data/resources/[Nimplex]/4rdm/data/auta/vehicles.json"
);

export const execute = async function ({ message, args }: CommandArgs) {
	const mention = message.mentions.members?.first();

	// prettier-ignore
	if (!existsSync(path))
		return message.channel.send({
			embeds: [
				ErrorEmbed(message, "Funkcja niedostępna na tym komputerze!"),
			],
		});

	if (
		(!mention && !args[0]) ||
		(mention && mention.id != args[0]?.replace(/[<@>]/gm, ""))
	)
		return message.channel.send({
			embeds: [
				ErrorEmbed(
					message,
					"Nie wprowadzono ID użytkownika / nie spingowano"
				),
			],
		});

	// prettier-ignore
	// @ts-ignore
	const userJson = (await import(path)).default;
	const response = await getUserHex(mention?.id || args[0]);

	if (!response[0])
		return message.channel.send({
			embeds: [ErrorEmbed(message, "Nie znaleziono użytkownika")],
		});

	if (args.length == 1) {
		const limitki: any = {};

		response.forEach((x: string) => {
			// @ts-ignore
			limitki[x.identifier] = userJson[x.identifier];
		});

		const description: string[] = [];

		const keys = Object.keys(limitki);

		Array.from(keys).forEach((hex: string) => {
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
		// prettier-ignore
		if (!args[1] || !args[2])
			return message.channel.send({
				embeds: [
					ErrorEmbed(message, "Prawidłowe użycie: `.limitka <@ping> <spawn> <nazwa wyświetlana>`"),
				],
			});

		if (response.length > 1) {
			const identifiers: any[] = response;

			message.channel.send(
				`\`\`\`Znalezione identyfikatory:\n${identifiers
					.map((x: any, i: number) => `${i + 1}. ${x.identifier}`)
					.join("\n")}\`\`\`\nKtóry z nich użyć?`
			);

			message.channel
				.awaitMessages({
					filter: msg => msg.author.id === message.author.id,
					max: 1,
					time: 60000,
					errors: ["time"],
				})
				.then(collectedMessages => {
					const firstMessage = collectedMessages.first();

					if (!firstMessage || !firstMessage.content)
						// prettier-ignore
						return message.channel.send({
							embeds: [ErrorEmbed(message, "Błąd bota, zgłoś do administratora")],
						}).then();

					let index = parseInt(firstMessage.content);

					if (isNaN(index))
						// prettier-ignore
						return message.channel.send({
							embeds: [ErrorEmbed(message, "Wprowadzono błędny index, nie jest cyfrą!")],
						}).then();

					index--;

					const currentHex: string = identifiers[index].identifier;

					if (!currentHex)
						// prettier-ignore
						return message.channel.send({
							embeds: [ErrorEmbed(message, "Wybrano błędny hex!")],
						}).then();

					if (!(<any>userJson)[currentHex])
						(<any>userJson)[currentHex] = [];

					const vehicleName = args.slice(2).join(" ");

					(<any>userJson)[currentHex].push([args[1], vehicleName]);

					writeFileSync(path, JSON.stringify(userJson), {
						encoding: "utf-8",
					});

					message.channel.send({
						embeds: [
							Embed({
								title: ":white_check_mark: | Dodano limitkę!",
								color: "#1F8B4C",
								author: {
									name:
										mention?.nickname ||
										mention?.user.tag ||
										"Brak",
									iconURL: mention?.displayAvatarURL(),
								},
								description: `**Hex**: \`${currentHex}\`\n**Spawn name**: \`${args[1]}\`\n**Display name**: \`${vehicleName}\``,
								user: message.author,
							}),
						],
					});
				})
				.catch(() => {
					message.channel.send({
						embeds: [ErrorEmbed(message, "Nie wybrano hexa!")],
					});
				});
		}
	}
};
export const info = {
	triggers: ["limitki"],
	description: "Zarządzanie limitkami graczy",
	permissions: ["ADMINISTRATOR"],
	role: "843444626726584370", // ZARZĄD
};
