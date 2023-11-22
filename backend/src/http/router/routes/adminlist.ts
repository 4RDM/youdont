import { Request, Response, Router } from "express";
import { internalError } from "../errors";
import logger from "utils/logger";
import { join } from "path";
import { readFile } from "fs/promises";
import { existsSync } from "fs";

const router = Router();

const ROLES: Record<string, number> = {
    "superadmin": 11,
    "zarzad": 10,
    "hadmin": 9,
    "senioradmin": 8,
    "admin": 7,
    "junioradmin": 6,
    "seniormoderator": 5,
    "moderator": 4,
    "juniormoderator": 3,
    "support": 2,
    "tsupport": 1
};

const filePath =
    process.env.NODE_ENV == "production" ?
        "/home/rdm/server/data/permisje.cfg" :
        join(__dirname, "..", "..", "..", "..", "permisje.cfg");

const cache = new Map<string, { lastSet: Date; data: Record<string, Record<string, string>> }>();

const getHighestRole = (roles: string[]) => {
    let highestRole = "";

    roles.map(role => {
        if (ROLES[role] > (ROLES[highestRole] || 0))
            highestRole = role;
    });

    return highestRole;
};

const parsePermissions = async (req: Request, file: string) => {
    let lines = file.split("\n");

    lines = lines.filter(line => line.startsWith("add_principal"));

    const splitLines = lines.map(line =>
        line.slice("add_principal".length, line.indexOf("#"))
            .replace(/identifier./g, "")
            .replace(/group./g, "")
            .trim()
            .split(" ")
    );

    const rolesByUser: Record<string, string[]> = {};

    splitLines.map(line => {
        if (Object.keys(ROLES).includes(line[1])) {
            if (!rolesByUser[line[0]]) rolesByUser[line[0]] = [];
            rolesByUser[line[0]].push(line[1]);
        }
    });

    for (const user in rolesByUser) {
        rolesByUser[user] = [ getHighestRole(rolesByUser[user]) ];
    }

    const discordRolesByUser: Record<string, Record<string, string>> = {};

    for await (const steamHex of Object.keys(rolesByUser)) {
        const discordID = await req.core.database.players.getDiscordBySteam(steamHex);

        if (!discordID || !discordID[0]) continue;

        const guild = await req.core.guilds.fetch(req.core.config.discord.mainGuild).catch(err => logger.error(`adminlist.parsePermissions(): ${err}`));

        if (!guild) continue;

        const member = await guild.members.fetch(discordID[0].replace(/discord:/g, "")).catch(err => logger.error(`adminlist.parsePermissions(): ${err}`));

        if (!member) continue;

        discordRolesByUser[discordID[0].replace(/discord:/g, "")] = { discord: discordID[0].replace(/discord:/g, ""), role: rolesByUser[steamHex][0], avatar: member.user.avatarURL({ forceStatic: false, size: 256 }) || "", tag: member.user.displayName };
    }

    return discordRolesByUser;
};

const getCache = async (req: Request, res: Response) => {
    if (!existsSync(filePath))
        return internalError(res, "Adminlist file not found (ERROR CODE: ADMINLIST_CONFIG_FILE_NOT_FOUND)");

    if (cache.has("adminlist")) {
        const cacheData = cache.get("adminlist");

        if (cacheData && new Date().getTime() - cacheData.lastSet.getTime() < 1000 * 60 * 60) {
            return res.json({ code: 200, data: cacheData.data });
        }
    }

    const file = await readFile(filePath, { encoding: "utf-8" }).catch(err => logger.error(`adminlist.init(): ${err}`));
    const fileContent = await parsePermissions(req, file.toString());

    cache.set("adminlist", {
        lastSet: new Date(),
        data: fileContent
    });

    return res.json({ code: 200, data: fileContent });
};

router.get("/", (req, res) => getCache(req, res));

export default router;