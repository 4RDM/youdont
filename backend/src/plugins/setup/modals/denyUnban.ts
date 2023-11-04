import { ModalSubmitArgs, ModalSubmitInfoType } from "handlers/modals";
import { getBan } from "./unban";
import { Embed } from "utils/embedBuilder";

export default async function ({ interaction, client, args }: ModalSubmitArgs) {
    if (!args || !args[1])
        return interaction.Error("Wystąpił błąd wewnętrzny, brak argumentów! Zgłoś się do administracji!", { ephemeral: true });

    const ban = await getBan(args[1]);

    if (!ban)
        return await interaction.Error("Nieznaleziono bana na liscie, prawdopodobnie się przedawnił", { ephemeral: true });

    const denyUnbanRes = await client.database.bans.denyUnban(parseInt(args[1]));

    if (denyUnbanRes == false)
        return await interaction.Error("Wystąpił błąd bazy danych, Skontaktuj się z administracją", { ephemeral: true });

    if (denyUnbanRes == undefined)
        return await interaction.Error("Nieznaleziono ID bana w bazie danych, skontaktuj się z administracją!", { ephemeral: true });

    const comment = interaction.fields.getTextInputValue("comment");

    if (!interaction.message)
        return await interaction.Error("Wiadomość z podaniem o unbana została usunięta, spróbuj napisać podanie ponownie!", { ephemeral: true });

    await interaction.message.edit({ components: [] });

    await interaction.Reply(
        [
            Embed({
                title: ":x: | Twoje podanie zostało odrzucone",
                fields: [
                    { name: "Nazwa użytkownika", value: `\`${ban.name}\``, inline: false },
                    { name: "ID bana", value: `\`${ban.banid}\``, inline: false },
                    { name: "Banujący", value: `\`${ban.banner}\``, inline: false },
                    { name: "Komentarz administratora", value: `\`\`\`${comment}\`\`\``, inline: false },
                ],
                color: "#f54242"
            })
        ],
        { content: `${denyUnbanRes.counter >= 3 ? `<@&843444626726584370>, podanie \`${args[1]}\` zostało odrzucone ${denyUnbanRes.counter} razy!` : ""} ${interaction.message.content}` }
    );
}

export const info: ModalSubmitInfoType = {
    name: "deny_unban"
};