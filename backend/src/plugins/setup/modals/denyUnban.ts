import { ModalSubmitArgs, ModalSubmitInfoType } from "handlers/modals";
import { getBan } from "./unban";
import { Embed } from "utils/embedBuilder";
import { existsSync } from "fs";
import { join } from "path";
import { doesUserHaveAnyRole } from "handlers/events/commands";
import { Roles, embedColors } from "utils/constants";

const path =
    process.env.NODE_ENV == "production" ?
        "/home/rdm/server/data/resources/[4rdm]/EasyAdmin-6/banlist.json" :
        join(__dirname, "..", "..", "..", "banlist.json");


export default async function ({ interaction, client, args }: ModalSubmitArgs) {
    if (!existsSync(path))
        return await interaction.Error("Funkcja niedostępna na tym komputerze, skontaktuj się z administracją!", { ephemeral: true });

    if (!args || !args[1])
        return await interaction.Error("Wystąpił błąd wewnętrzny, brak argumentów! Zgłoś się do administracji!", { ephemeral: true });

    if (!interaction.inGuild())
        return await interaction.Error("Nie możesz użyć tej komendy w DM!", { ephemeral: true });

    const bannerDiscordID = interaction.message?.embeds[0].fields.find(x => x.name == "Banujący");

    if (!bannerDiscordID)
        return await interaction.Error("Nie można znaleźć ID banującego, skontaktuj się z administracją!", { ephemeral: true });

    if (bannerDiscordID.value.replace(/[<@>]/gm, "") != interaction.user.id && !doesUserHaveAnyRole(interaction.member.roles, [ "843444626726584370" ]))
        return await interaction.Error("Nie możesz odrzucić unbana, ponieważ nie jesteś banującym!", { ephemeral: true });

    const ban = await getBan(args[1]);

    if (!ban)
        return await interaction.Error("Nieznaleziono bana na liscie, prawdopodobnie się przedawnił", { ephemeral: true });

    const denyUnbanRes = await client.database.bans.denyUnban(parseInt(args[1]));

    if (denyUnbanRes === false)
        return await interaction.Error("Wystąpił błąd bazy danych, Skontaktuj się z administracją", { ephemeral: true });

    if (denyUnbanRes == undefined)
        return await interaction.Error("Nieznaleziono ID bana w bazie danych, skontaktuj się z administracją!", { ephemeral: true });

    const comment = interaction.fields.getTextInputValue("comment");

    if (!interaction.message)
        return await interaction.Error("Wiadomość z podaniem o unbana została usunięta, spróbuj napisać podanie ponownie!", { ephemeral: true });

    await interaction.message.edit({ components: [] });

    return await interaction.Reply(
        [
            Embed({
                title: ":x: | Twoje podanie zostało rozpatrzone negatywnie",
                fields: [
                    { name: "Nazwa użytkownika", value: `\`${ban.name}\``, inline: false },
                    { name: "ID bana", value: `\`${ban.banid}\``, inline: false },
                    { name: "Banujący", value: interaction.message.embeds[0].fields.find(x => x.name == "Banujący")?.value || "`Nie znaleziono`", inline: false },
                    { name: "Komentarz administratora", value: `\`\`\`${comment}\`\`\``, inline: false },
                ],
                color: embedColors.red,
                user: interaction.user
            })
        ],
        { content: `${interaction.message.content.split("|")[0].trim()} | ${denyUnbanRes.counter >= 3 ? `<@&843444626726584370>, podanie \`${args[1]}\` zostało odrzucone ${denyUnbanRes.counter} razy!` : ""}` }
    );
}

export const info: ModalSubmitInfoType = {
    name: "deny_unban",
    roles: [ Roles.Team ]
};