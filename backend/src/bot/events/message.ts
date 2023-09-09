import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Channel,
    Message,
    WebhookClient,
} from "discord.js";
import { checkMessage } from "../handlers/automoderator";
import { Embed, ErrorEmbed } from "../../utils/discordEmbed";
import { isSimilar } from "../../utils/isSimilar";
import { Donate } from "../../database/managers/donates";

const wordlist = [
    {
        msg: "Skąd wziąść donator",
        res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/articles/wplata-na-serwer",
    },
    {
        msg: "Skąd wziąść partner",
        res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/articles/wplata-na-serwer",
    },
    {
        msg: "gdzie kupić donator",
        res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/articles/wplata-na-serwer",
    },
    {
        msg: "gdzie kupić partner",
        res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/articles/wplata-na-serwer",
    },
    {
        msg: "co daje mi partner",
        res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/articles/wplata-na-serwer",
    },
    {
        msg: "co daje mi donator",
        res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/articles/wplata-na-serwer",
    },
    {
        msg: "jak kupić partner",
        res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/articles/wplata-na-serwer",
    },
    {
        msg: "jak kupić donator",
        res: "Wszystkie informacje znajdziesz na: https://4rdm.pl/articles/wplata-na-serwer",
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

let propozycjeWebhook: WebhookClient | null = null;
let donateChannel: Channel | null = null;
let afterInit = false;

export async function init(client: ClientType) {
    propozycjeWebhook = new WebhookClient({ url: client.config.propozycjeWebhook });
    donateChannel = await client.channels.fetch("843586192879517776");
    afterInit = true;
}

export default async function ({ client, props }: { client: ClientType; props: { "0": Message } }) {
    if (!afterInit) await init(client);

    const message = props["0"];

    if (message.author.bot) return;

    await client.core.database.users.create(message.author.id);

    if (message.guild) {
        checkMessage(message.content).then(s => {
            if (!s) return;
            message.member?.timeout(120 * 60 * 1000, "Phishing / scam URL"); // for 2 hours
            message.delete();

            return;
        });

        wordlist.forEach(word => isSimilar(message.content, word.msg) && message.reply(word.res));

        if (message.channel.id == "843444752279666728") {
            if (!propozycjeWebhook) return;

            message.delete();

            const createdMessage = await propozycjeWebhook.send({
                username: message.author.username,
                avatarURL: message.author.displayAvatarURL(),
                embeds: [
                    Embed({
                        color: "#ffffff",
                        description: message.content,
                        user: message.author,
                    }),
                ]
            });

            const fetchMessage = await message.channel.messages.fetch(createdMessage.id);
            fetchMessage.startThread({
                name: `Propozycja od ${message.author.username}`,
                reason: "Propozycja",
                autoArchiveDuration: 10080,
            });

            return;
        }

        return;
    } else {
        const content = message.content.split("\n");
        const [commandName, ...args] = message.content.split(/ +/g);

        if (!donateChannel || !donateChannel.isTextBased())
            return message.channel.send({ embeds: [ErrorEmbed(message, "Wystąpił wewnętrzny błąd bota (KOD: CHANNEL_NOT_FOUND). Spróbuj ponownie później / skontaktuj się z administracją!")] });

        if (commandName == "donate") {
            let type = "";
            let kodPSC = "";
            let donate: Donate | null = null;

            if (args[0] == "tipply") {
                donate = await client.core.database.donates.create({ discordID: message.author.id, type: "tipply" });

                if (!donate)
                    return message.channel.send({ embeds: [ErrorEmbed(message, "Wystąpił wewnętrzny błąd bota (KOD: DONATE_DB_ERROR). Spróbuj ponownie później / skontaktuj się z administracją!")] });

                type = "tipply";

                message.channel.send({
                    embeds: [
                        Embed({
                            title: "Donate",
                            description: `Przy wypełnianiu formularza, **w okienku na wiadomość wpisz swoje ID wpłaty (\`${donate.id}\`)**. Pamiętaj że musisz być członkiem naszego **[serwera Discord](https://discord.gg/U3mm6NVdyq)**. **[Link do wpłaty](https://tipply.pl/u/4RDM)**`,
                            color: "#ffffff",
                            user: message.author,
                        }),
                    ],
                });
            } else if (args[0] == "paypal") {
                donate = await client.core.database.donates.create({ discordID: message.author.id, type: "paypal" });

                if (!donate)
                    return message.channel.send({ embeds: [ErrorEmbed(message, "Wystąpił wewnętrzny błąd bota (KOD: DONATE_DB_ERROR). Spróbuj ponownie później / skontaktuj się z administracją!")] });

                type = "paypal";

                message.channel.send({
                    embeds: [
                        Embed({
                            title: "Donate",
                            description: `Przy wypełnianiu formularza, **w okienku na wiadomość wpisz swoje ID wpłaty (\`${donate.id}\`)**. Pamiętaj że musisz być członkiem naszego **[serwera Discord](https://discord.gg/U3mm6NVdyq)**. **[Link do wpłaty](https://paypal.me/4rdmpl)**`,
                            color: "#ffffff",
                            user: message.author,
                        }),
                    ],
                });
            } else if (args[0] == "psc") {
                if (!args[1] || (args[1].length !== 16 && args[1].length !== 19))
                    return message.channel.send({ embeds: [ErrorEmbed(message, "Kod jest nieprawidłowy, pamiętaj aby kod wpisywać w prawidłowym formacie!\n`1234-1234-1234-1234` bądź `1234123412341234`")] });

                donate = await client.core.database.donates.create({ discordID: message.author.id, type: "psc" });
				
                if (!donate)
                    return message.channel.send({ embeds: [ErrorEmbed(message, "Wystąpił wewnętrzny błąd bota (KOD: DONATE_DB_ERROR). Spróbuj ponownie później / skontaktuj się z administracją!")] });

                type = "psc";
                kodPSC = args[1];

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

            if (type == "") return;
            if (!donate)
                return message.channel.send({ embeds: [ErrorEmbed(message, "Wystąpił wewnętrzny błąd bota (KOD: DONATE_GLOBAL_DB_ERROR). Spróbuj ponownie później / skontaktuj się z administracją!")] });

            const acceptButton = new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel("Akceptuj").setCustomId(`donateAccept_${donate.id}`);
            const rejectButton = new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel("Odrzuć").setCustomId(`donateReject_${donate.id}`);
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(acceptButton, rejectButton);

            donateChannel.send({
                content: `Wpłata ${type == "psc" ? "paysafecard" : type} od gracza ${message.author.tag} (\`${message.author.id}\`) (<@${message.author.id}>) ${kodPSC !== "" ? `: ${kodPSC}` : ""}\nID wpłaty: \`${donate.id}\``,
                components: [row]
            });

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
