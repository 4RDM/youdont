import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { ModalSubmitArgs, ModalSubmitInfoType } from "handlers/modals";
import { join } from "path";


const path =
    process.env.NODE_ENV == "production" ?
        "/home/rdm/server/data/resources/[4rdm]/EasyAdmin-6/banlist.json" :
        join(__dirname, "..", "..", "..", "banlist.json");

export interface Ban {
    expire: number
    identifiers: string[]
    banner: string
    bannersteam: string
    banid: number
    expireString: string
    name: string
    reason: string
}

export const getBan = async(banID: string) => {
    const file = await readFile(path, { encoding: "utf-8" });
    const banlist: Ban[] = JSON.parse(file.toString());
    const ban = banlist.find(ban => ban.banid == parseInt(banID));

    return ban;
};

export const getBanBySteam = async(hex: string) => {
    const file = await readFile(path, { encoding: "utf-8" });
    const banlist: Ban[] = JSON.parse(file.toString());
    const ban = banlist.reverse().find(ban => ban.identifiers.includes(`steam:${hex}`));

    return ban;
};

export default async function ({ interaction, client }: ModalSubmitArgs) {
    if (!existsSync(path))
        return interaction.Error("Funkcja niedostępna na tym komputerze, skontaktuj się z administracją!", { ephemeral: true });

    const banID = interaction.fields.getTextInputValue("banID");
    const reason = interaction.fields.getTextInputValue("reason");
    const rateLimit = client.getRatelimit("unban", interaction.user.id);

    if (rateLimit && !client.hasExpired("unban", interaction.user.id))
        return await interaction.Error(`Jesteś ograniczony czasowo! Kolejne odwołanie możesz napisać <t:${Math.floor(rateLimit.getTime() / 1000)}>`, { ephemeral: true });

    if (isNaN(parseInt(banID)))
        return await interaction.Error("Wprowadzono nieprawidłowe ID bana", { ephemeral: true });

    const ban = await getBan(banID);

    if (!ban || !ban.identifiers.includes(`discord:${interaction.user.id}`))
        return await interaction.Error("Nie znaleziono bana nałożonego na twoje konto discord! Odwołaj się na tickecie", { ephemeral: true });

    console.log(ban, reason);

    interaction.Reply("test");
}

export const info: ModalSubmitInfoType = {
    name: "unban_form"
};