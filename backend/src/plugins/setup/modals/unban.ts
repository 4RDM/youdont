import { readFile } from "fs/promises";
import { ModalSubmitArgs, ModalSubmitInfoType } from "handlers/modals";
import { join } from "path";


const banlistPath =
    process.env.NODE_ENV == "production" ?
        "/home/rdm/server/data/resources/[4rdm]/EasyAdmin-6/banlist.json" :
        join(__dirname, "..", "..", "..", "data", "banlist.json");

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
    const file = await readFile(banlistPath, { encoding: "utf-8" });
    const banlist: Ban[] = JSON.parse(file.toString());
    const ban = banlist.find(ban => ban.banid == parseInt(banID));

    return ban;
};

export const getBanBySteam = async(hex: string) => {
    const file = await readFile(banlistPath, { encoding: "utf-8" });
    const banlist: Ban[] = JSON.parse(file.toString());
    const ban = banlist.reverse().find(ban => ban.identifiers.includes(`steam:${hex}`));

    return ban;
};

export default async function ({ interaction }: ModalSubmitArgs) {
    interaction.Reply("test");
}

export const info: ModalSubmitInfoType = {
    name: "test",
    description: "test",
};