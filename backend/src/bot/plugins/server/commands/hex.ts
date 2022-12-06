import { CommandArgs } from "../../../../types";
import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";

export const execute = async function ({ client, message, args }: CommandArgs) {
    if (!args[0] || !message.mentions.users.first()) return message.channel.send({
        embeds: [ErrorEmbed(message, "Nie wprowadzono ID użytkownika / nie spingowano")],
    });

    const user = await client.Core.database.users.getUserFromServer(message.mentions.users.first()?.id || args[0]);

    if (!user) return message.channel.send({
            embeds: [ErrorEmbed(message, "Nie znaleziono użytkownika")],
        });
    else return message.channel.send(`\`\`\`${user.identifier}\`\`\``);
}

export const info = {
    triggers: ["hex"],
    description: "Sprawdź hex użytkownika"
};