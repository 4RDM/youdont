import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";

export const execute = async function ({ message, args, client }: CommandArgs) {
	const member = message.mentions.members?.first();

	if (!member)
		return message.channel.send({
			embeds: [
				ErrorEmbed(
					message,
					"Prawidłowe użycie: `.notatka <użytkownik> [dodaj/usun] <dodaj:tresc notatki/usun:id notatki>`"
				),
			],
		});

	const dbUser = await client.Core.database.users.get(member.id);

	if (!dbUser)
		return message.channel.send({
			embeds: [
				ErrorEmbed(
					message,
					"Nieznaleziono użytkownika w bazie danych!"
				),
			],
		});

	if (args.length < 2) {
		const description: string[] = [];

		// prettier-ignore
		dbUser?.notatki.forEach((notatka: any) => {
			description.push(`**#${notatka.id}** | \`${notatka.content.substring(0, 20)}...\` ${notatka.authorID ? `- <@${notatka.authorID}>` : ""} ${notatka.date ? `- <t:${notatka.date}>` : ""}`);
		});

		message.channel.send({
			embeds: [
				Embed({
					author: {
						name: member.nickname || member.user.tag,
						iconURL: member.displayAvatarURL(),
					},
					user: message.author,
					title: "Notatki dla użytkownika",
					description: description.join("\n"),
				}),
			],
		});
	} else {
		// prettier-ignore
		if (!["dodaj", "add", "usun", "usuń", "remove"].includes(args[1].toLowerCase())) {
				const id = parseInt(args[1]);

				if (isNaN(id))
					return message.channel.send({
						embeds: [ErrorEmbed(message, "ID notatki nie może być puste")],
					});

				const notatka = dbUser?.notatki.find((x: any) => x.id == id);

				if (!notatka)
					return message.channel.send({
						embeds: [
							ErrorEmbed(
								message,
								`Nie znaleziono notatki od id ${id || "brak"}`
							),
						],
					});

				message.channel.send({
					embeds: [
						Embed({
							author: {
								name: member.nickname || member.user.tag,
								iconURL: member.displayAvatarURL(),
							},
							user: message.author,
							title: `Notatka #${notatka.id}`,
							description: `\`\`\`${notatka.content}\`\`\``,
						}),
					],
				});

				return;
			}

		if (["dodaj", "add"].includes(args[1].toLowerCase())) {
			const content = args.slice(2).join(" ");

			if (content.length < 2)
				return message.channel.send({
					embeds: [
						ErrorEmbed(
							message,
							`Notatka nie może mieć mniej niż 2 znaki`
						),
					],
				});

			const notatka = {
				id: (
					parseInt(
						dbUser.notatki[dbUser.notatki.length - 1]?.id || 0
					) + 1
				).toString(),
				content,
				authorID: message.author.id,
				date: Math.floor(Date.now() / 1000),
			};

			dbUser?.notatki.push(notatka);
			await dbUser?.save();

			message.channel.send({
				embeds: [
					Embed({
						title: ":pencil: | Dodano notatkę!",
						color: "#1F8B4C",
						user: message.author,
					}),
				],
			});
		} else if (["usun", "usuń", "remove"].includes(args[1].toLowerCase())) {
			const id = parseInt(args[2]);

			if (isNaN(id))
				return message.channel.send({
					embeds: [
						ErrorEmbed(
							message,
							"ID notatki do usunięcia nie może być puste"
						),
					],
				});

			const notatka = dbUser?.notatki.find(
				(x: any) => x.id.toString() === id.toString()
			);

			if (!notatka)
				return message.channel.send({
					embeds: [ErrorEmbed(message, "Nie znaleziono notatki")],
				});

			const notatki = dbUser?.notatki.filter(
				(x: any) => x.id.toString() !== id.toString()
			);

			dbUser.notatki = notatki;
			await dbUser.save();

			const description: string[] = [];

			// prettier-ignore
			dbUser?.notatki.forEach((notatka: any) => {
				description.push(`**#${notatka.id}** | \`${notatka.content.substring(0, 20)}...\` ${notatka.authorID ? `- <@${notatka.authorID}>` : ""} ${notatka.date ? `- <t:${notatka.date}>` : ""}`);
			});

			message.channel.send({
				embeds: [
					Embed({
						title: ":coffin: | Usunięto notatke!",
						color: "#f54242",
						user: message.author,
						description: `Pozostałe notatki:\n${description.join(
							"\n"
						)}`,
					}),
				],
			});
		}
	}
};

export const info: CommandInfo = {
	triggers: ["notatka", "note", "n"],
	description: "Notatki",
	permissions: ["BanMembers", "KickMembers"],
};
