import { getBan } from "./unban";
import { existsSync } from "fs";
import { ModalSubmitArgs, ModalSubmitInfoType } from "handlers/modals";
import { join } from "path";
import { Embed } from "utils/embedBuilder";
import logger from "utils/logger";

const path =
    process.env.NODE_ENV == "production" ?
        "/home/rdm/server/data/resources/[4rdm]/EasyAdmin-6/banlist.json" :
        join(__dirname, "..", "..", "..", "banlist.json");

export const removeBan = async(banID: number) => {
    // const file = await readFile(path, { encoding: "utf-8" });
    // const banlist: Ban[] = JSON.parse(file.toString());
    // const banlistNew = banlist.filter((ban) => ban.banid !== banID);
    // return await writeFile(path, JSON.stringify(banlistNew, null, 4), { encoding: "utf-8" });
    /* TODO: implement rcon */
    banID;
};

export default async function ({ interaction, client, args }: ModalSubmitArgs) {
    if (!existsSync(path))
        return interaction.Error("Funkcja niedostępna na tym komputerze, skontaktuj się z administracją!", { ephemeral: true });

    if (!args || !args[1])
        return interaction.Error("Wystąpił błąd wewnętrzny, brak argumentów! Zgłoś się do administracji!", { ephemeral: true });

    const ban = await getBan(args[1]);

    if (!ban)
        return await interaction.Error("Nieznaleziono bana na liscie, prawdopodobnie się przedawnił", { ephemeral: true });

    try {
        await removeBan(parseInt(args[1]));
    } catch(err) {
        return logger.error(`acceptUnban.execute(): Cannot save banlist! ${err}`);
    }

    const acceptUnbanRes = await client.database.bans.acceptUnban(parseInt(args[1]));

    if (acceptUnbanRes == false)
        return await interaction.Error("Wystąpił błąd bazy danych, Skontaktuj się z administracją", { ephemeral: true });

    const comment = interaction.fields.getTextInputValue("comment");

    if (!interaction.message)
        return await interaction.Error("Wiadomość z podaniem o unbana została usunięta, spróbuj napisać podanie ponownie!", { ephemeral: true });

    await interaction.message.edit({ components: [] });

    await interaction.Reply(
        [
            Embed({
                title: ":white_check_mark: | Twoje podanie zostało rozpatrzone pozytywnie",
                fields: [
                    { name: "Nazwa użytkownika", value: `\`${ban.name}\``, inline: false },
                    { name: "ID bana", value: `\`${ban.banid}\``, inline: false },
                    { name: "Banujący", value: `\`${ban.banner}\``, inline: false },
                    { name: "Komentarz administratora", value: `\`\`\`${comment}\`\`\``, inline: false },
                ],
                color: "#42f569",
                user: interaction.user
            })
        ],
        { content: interaction.message.content }
    );
}

export const info: ModalSubmitInfoType = {
    name: "accept_unban"
};