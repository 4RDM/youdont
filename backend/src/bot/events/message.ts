import {
    Message,
    WebhookClient,
} from "discord.js";
import { checkMessage } from "../handlers/automoderator";
import { Embed } from "../../utils/discordEmbed";
import { isSimilar } from "../../utils/isSimilar";

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
let afterInit = false;

export async function init(client: ClientType) {
    propozycjeWebhook = new WebhookClient({ url: client.config.propozycjeWebhook });
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
