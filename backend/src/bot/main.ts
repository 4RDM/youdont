import { Client as Cl, ClientOptions, TextChannel } from "discord.js";
import PluginHandler from "./handlers/plugin.handler";
import CommandHandler from "./handlers/command.handler";
import isSimilar from "../utils/isSimilar";
import logger from "../utils/logger";
import { Embed, ErrorEmbed } from "../utils/discordEmbed";
import config from "../config";
import { Core } from "../";
import { checkMessage } from "./handlers/automoderator.handler";
import { Message, PermissionResolvable } from "discord.js";

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

declare global {
	interface CommandArgs {
		client: Client;
		message: Message;
		args: any[];
	}

	interface Command {
		info: {
			triggers: string[];
			description: string;
			role?: string;
			permissions?: PermissionResolvable[];
		};
		execute({
			client,
			message,
			args,
		}: {
			client: Client;
			message: Message;
			args: string[];
		}): Promise<void>;
	}
}

export class Client extends Cl {
	public readonly PluginHandler: PluginHandler;
	public readonly CommandHandler: CommandHandler;
	public readonly Core: Core;

	constructor(core: Core, options: ClientOptions) {
		super(options);

		this.Core = core;
		this.PluginHandler = new PluginHandler();
		this.CommandHandler = new CommandHandler(this);

		const verificationRole =
			core.database.settings.settings.verificationRole;

		// TODO: przenieść eventy do handlera
		this.on("ready", async () => {
			logger.ready("Bot is ready!");

			const reloadStats = () => {};

			setInterval(reloadStats, 10000);
		});

		this.on("messageCreate", async message => {
			if (message.author.bot) return;

			core.database.users.createIfNotExists(message.author.id);

			// prettier-ignore
			if (!message.content.startsWith(config.discord.prefix) && message.guild) {
				checkMessage(message.content).then(s => {
					if (!s) return;
					message.member?.timeout(120 * 60 * 1000, "Phishing / scam URL"); // for 2 hours
					message.delete();
				});

				// Autoreply
				wordlist.forEach(word => isSimilar(message.content, word.msg) && message.reply(word.res));
				return;
			}

			// prettier-ignore
			if (message.guild) {
				const [commandName, ...args] = message.content.slice(config.discord.prefix.length).split(/ +/g);
				const command = this.CommandHandler.get(commandName);

				if (command) {
					if ((command.info.role && message.member?.roles.cache.has(command.info.role)) || message.member?.permissions.has(command.info.permissions || []))
						command.execute({ client: this, message, args });
					else message.react("❌");
				}
			} else {
				const content = message.content.split("\n");
				const [commandName, ...args] = message.content.split(/ +/g);

				if (commandName == "donate") {
					if (args[0] == "tipply") {
						const document =
							await this.Core.database.donates.create({
								userID: message.author.id,
								type: "tipply",
								timestamp: new Date(),
							});

						(<TextChannel>(
							await this.channels.fetch("843586192879517776") // donate channel
						)).send(`Wpłata tipply od gracza ${message.author.tag} (\`${message.author.id}\`)\n (\`!zaakceptuj ${document.dID}\` / \`!odrzuć ${document.dID}\`)`);

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
							await this.Core.database.donates.create({
								userID: message.author.id,
								type: "paypal",
								timestamp: new Date(),
							});

						(<TextChannel>(
							await this.channels.fetch("843586192879517776")
						)).send(`Wpłata paypal od gracza ${message.author.tag} (\`${message.author.id}\`)\n (\`!zaakceptuj ${document.dID}\` / \`!odrzuć ${document.dID}\`)`);

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
								embeds: [ ErrorEmbed(message, "Kod jest nieprawidłowy, pamiętaj aby kod wpisywać w prawidłowym formacie!\n`1234-1234-1234-1234` bądź `1234123412341234`") ],
							});
							return;
						}

						const document =
							await this.Core.database.donates.create({
								userID: message.author.id,
								type: "psc",
								timestamp: new Date(),
							});

						(<TextChannel>(
							await this.channels.fetch("843586192879517776")
						)).send(`Wpłata psc od gracza ${message.author.tag} (\`${message.author.id}\`): ${args[1]}\n (\`!zaakceptuj ${document.dID}\` / \`!odrzuć ${document.dID}\`)`);
					}

					return;
				}

				if (commandName == "help") return 
					message.channel.send("Dostępne komendy: `donate`");

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
		});

		this.login(config.discord.token);
	}
}
