import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";
import { CommandArgs } from "../../../../types";

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
			description.push(`**#${notatka.id}** | \`${notatka.content.substring(0, 20)}...\``);
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
					color: "#d900ff",
					description: description.join("\n"),
				}),
			],
		});
	} else {
		if (args.length < 3) {
			const id = parseInt(args[1]);
			const notatka = dbUser?.notatki.find((x: any) => x.id == id);

			if (!notatka)
				return message.channel.send({
					embeds: [
						ErrorEmbed(
							message,
							`Nie znaleziono notatki od id ${id}`
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

		// prettier-ignore
		if (!["dodaj", "add", "usun", "usuń", "remove"].includes(args[1].toLowerCase())) 
			return message.channel.send({
				embeds: [
					ErrorEmbed(message, "Dostępne metody to: `dodaj, add, usun, usuń, remove`")
				]
			});

		if (["dodaj", "add"].includes(args[1].toLowerCase())) {
			const content = args.slice(2).join(" ");

			const notatka = {
				id: (
					parseInt(dbUser.notatki[dbUser.notatki.length - 1].id) + 1
				).toString(),
				content,
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
						ErrorEmbed(message, "ID notatki nie może być NaN"),
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

			message.channel.send({
				embeds: [
					Embed({
						title: ":coffin: | Usunięto notatke!",
						color: "#f54242",
						user: message.author,
					}),
				],
			});
		}
	}
};

export const info = {
	triggers: ["notatka", "note", "n"],
	description: "Notatki",
	permissions: ["BAN_MEMBERS", "KICK_MEMBERS"],
};
