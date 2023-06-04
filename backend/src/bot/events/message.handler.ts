import { Message, TextChannel } from "discord.js";
import { checkMessage } from "../handlers/automoderator.handler";
import { Embed, ErrorEmbed } from "../../utils/discordEmbed";
import { isSimilar } from "../../utils/isSimilar";
import { Users } from "../../database/managers/users";
import { Notatki } from "../../database/managers/notatka";

const wordlist = [
	{
		msg: "Skąd wziąść donator",
		res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/article-wplata-na-serwer",
	},
	{
		msg: "Skąd wziąść partner",
		res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/article-wplata-na-serwer",
	},
	{
		msg: "gdzie kupić donator",
		res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/article-wplata-na-serwer",
	},
	{
		msg: "gdzie kupić partner",
		res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/article-wplata-na-serwer",
	},
	{
		msg: "co daje mi partner",
		res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/article-wplata-na-serwer",
	},
	{
		msg: "co daje mi donator",
		res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/article-wplata-na-serwer",
	},
	{
		msg: "jak kupić partner",
		res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/article-wplata-na-serwer",
	},
	{
		msg: "jak kupić donator",
		res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/article-wplata-na-serwer",
	},
	{
		msg: "Kiedy otwarte podania na triala",
		res: "Sprawdź czy nie są obecnie otwarte na <#843444756821966878> (otwieramy średnio co miesiąc)",
	},
	{
		msg: "Kiedy wyniki podań?",
		res: "Wyniki podań publikujemy max do tygodnia po ich zamknięciu",
	},
	{
		msg: "Kiedy gotowe auto",
		res: "Auta dodajemy średnio do 2-3 dni",
	},
	{
		msg: "Kiedy zrobisz auto",
		res: "Auta dodajemy średnio do 2-3 dni",
	},
];

export default async function ({
	client,
	props,
}: {
	client: ClientType;
	props: { "0": Message };
}) {
	const message = props["0"];

	const [commandName, ...args] = message.content
		.slice(client.config.discord.prefix.length)
		.trim()
		.split(/ +/g);

	console.log(commandName, args);

	if (message.author.bot) return;

	client.Core.database.users.createIfNotExists(message.author.id);

	if (commandName == "test") {
		const users = new Users(client.Core);
		const use = await users.createIfNotExists(message.author.id);
		console.log(use);
	}

	if (commandName == "test2") {
		const notatki = new Notatki(client.Core);
		const notatka = await notatki.create({
			discordID: message.author.id,
			content: "test",
		});

		console.log(notatka);
	}

	if (commandName == "test3") {
		const notatki = new Notatki(client.Core);
		const notatka = await notatki.delete(
			message.author.id,
			parseInt(args[0])
		);
		console.log(notatka);
	}

	if (commandName == "test4") {
		const notatki = new Notatki(client.Core);

		const uzyszkodnik = await client.Core.database.users.get(
			message.author.id
		);

		if (!uzyszkodnik) return;

		// go through all notes and create prisma model for them

		for (const notatka of uzyszkodnik.notatki) {
			console.log(notatka);
			const res = await notatki.create({
				discordID: message.author.id,
				content: notatka.content,
				createdAt: new Date(notatka.date * 1000),
			});
			console.log(res);
		}
	}

	if (
		!message.content.startsWith(client.config.discord.prefix) &&
		message.guild
	) {
		checkMessage(message.content).then(s => {
			if (!s) return;
			message.member?.timeout(120 * 60 * 1000, "Phishing / scam URL"); // for 2 hours
			message.delete();
		});

		// Autoreply
		wordlist.forEach(
			word =>
				isSimilar(message.content, word.msg) && message.reply(word.res)
		);
		return;
	}

	// prettier-ignore
	if (!message.guild) {
		const content = message.content.split("\n");
		const [commandName, ...args] = message.content.split(/ +/g);

		if (commandName == "donate") {
			if (args[0] == "tipply") {
				const document =
							await client.Core.database.donates.create({
								userID: message.author.id,
								type: "tipply",
								timestamp: new Date(),
							});

				(<TextChannel>(
							await client.channels.fetch("843586192879517776") // donate channel
						)).send(
					`Wpłata tipply od gracza ${message.author.tag} (\`${message.author.id}\`)\n (\`!zaakceptuj ${document.dID}\` / \`!odrzuć ${document.dID}\`)`
				);

				message.channel.send({
					embeds: [
						Embed({
							title: "Donate",
							description: `Przy wypełnianiu formularza, **w okienku na wiadomość wpisz swoje ID wpłaty (\`${document.dID}\`)**. Pamiętaj że musisz być członkiem naszego **[serwera Discord](https://discord.gg/U3mm6NVdyq)**. **[Link do wpłaty](https://tipply.pl/u/4RDM)**`,
							color: "#ffffff",
							user: message.author,
						}),
					],
				});
			} else if (args[0] == "paypal") {
				const document =
							await client.Core.database.donates.create({
								userID: message.author.id,
								type: "paypal",
								timestamp: new Date(),
							});

				(<TextChannel>(
							await client.channels.fetch("843586192879517776")
						)).send(
					`Wpłata paypal od gracza ${message.author.tag} (\`${message.author.id}\`)\n (\`!zaakceptuj ${document.dID}\` / \`!odrzuć ${document.dID}\`)`
				);

				message.channel.send({
					embeds: [
						Embed({
							title: "Donate",
							description: `Przy wypełnianiu formularza, **w okienku na wiadomość wpisz swoje ID wpłaty (\`${document.dID}\`)**. Pamiętaj że musisz być członkiem naszego **[serwera Discord](https://discord.gg/U3mm6NVdyq)**. **[Link do wpłaty](https://paypal.me/fourxrdm)**`,
							color: "#ffffff",
							user: message.author,
						}),
					],
				});
			} else if (args[0] == "psc") {
				if (!args[1] || (args[1].length !== 16 && args[1].length !== 19)) {
					message.channel.send({
						embeds: [ErrorEmbed(message, "Kod jest nieprawidłowy, pamiętaj aby kod wpisywać w prawidłowym formacie!\n`1234-1234-1234-1234` bądź `1234123412341234`")],
					});
					return;
				}

				const document =
							await client.Core.database.donates.create({
								userID: message.author.id,
								type: "psc",
								timestamp: new Date(),
							});

				(<TextChannel>(
							await client.channels.fetch("843586192879517776")
						)).send(
					`Wpłata psc od gracza ${message.author.tag} (\`${message.author.id}\`): ${args[1]}\n (\`!zaakceptuj ${document.dID}\` / \`!odrzuć ${document.dID}\`)`
				);

				message.channel.send({
					embeds: [
						Embed({
							title: "Donate",
							description: "Wysłano kod do administracji!\nWeryfikacja kodu w dni wolne może trwać dłużej niż zazwyczaj.",
							color: "#ffffff",
							user: message.author,
						}),
					],
				});
			} else {
				message.channel.send({
					embeds: [
						Embed({
							title: "Donate",
							description: "Dostępne metody wpłat: `tipply`, `paypal`, `psc`",
							color: "#ffffff",
							user: message.author,
						}),
					],
				});
			}

			return;
		}

		if (commandName == "help") return message.channel.send("Dostępne komendy: `donate`");

		message.channel.send({
			embeds: [
				Embed({
					description: `${content
						.map((x: string) => `> ${x}`)
						.join(
							"\n"
						)}\n\nNie rozumiem co chcesz mi przekazać! Spróbuj \`help\` aby uzyskać dostępne polecenia!`,
					color: "#f54242",
					user: message.author,
				}),
			],
		});
	}
}

export const info: EventInfo = {
	eventName: "messageCreate",
};
