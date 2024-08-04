import { NextFunction, Request, Response, Router } from "express";
import FormData from "form-data";
import fetch from "node-fetch";
import logger from "../../../utils/logger";
import config from "../../../config";
import timeSince from "utils/timeSince";
import { internalError, notFound, unauthorized } from "../errors";
import rateLimit from "express-rate-limit";
import { DBUser } from "database/playerData";

interface IUserCache {
    [index: string]: {
        identifier?: string;
        license?: string;
        discord?: string;
        deaths?: number;
        heady?: number;
        kills?: number;
        date?: Date;
        playTime?: number;
        rank?: string;
    };
}

const router = Router();
const userCache: IUserCache = {};

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: true,
    skip: req => {
        if (req.skip) {
            req.skip = false;
            return true;
        } else return false;
    },
});

const userCheck = (req: Request, res: Response, next: NextFunction) => {
    const { username, userid, email } = req.session;

    if (username && userid && email) {
        req.skip = true;
        next();
    }
    else {
        res.status(401).json({ code: 401, message: "Unauthorized, not logged in" });
    }
};

router.get("/login", limiter, (_, res) => res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${config.discord.clientId}&redirect_uri=${config.discord.redirectUri}&response_type=code&scope=email%20identify%20guilds.join`));

router.get("/reply", async(req, res) => {
    try {
        const code = <string | undefined>req.query.code;

        if (!code) return res.send("Unauthorized, no code provided");

        const form = new FormData();
        form.append("client_id", config.discord.clientId);
        form.append("client_secret", config.discord.secret);
        form.append("redirect_uri", config.discord.redirectUri);
        form.append("grant_type", "authorization_code");
        form.append("code", code);

        const oauth2 = await fetch("https://discord.com/api/oauth2/token", { method: "POST", body: form }).then(res => res.json());
        if (!oauth2) return internalError(res, "No oauth2 data provided");

        const user = await fetch("https://discord.com/api/users/@me", { method: "GET", headers: { authorization: `${oauth2.token_type} ${oauth2.access_token}` } }).then(res => res.json());
        if (!user) return internalError(res, "No user data provided");

        const { email, avatar, username, id } = user;

        if (user.code == 0)
            return internalError(res, "Discord returned an internal error");

        if (!email || !avatar || !username || !id)
            return internalError(res, "Discord returned an error, missing data");

        fetch(`https://discord.com/api/guilds/${config.discord.mainGuild}/members/${id}`,{
            body: JSON.stringify({ access_token: oauth2.access_token }),
            headers: { authorization: `Bot ${config.discord.token}`, "Content-Type": "application/json" },
            method: "PUT",
        }).catch();

        req.session.username = username;
        req.session.userid = id;
        req.session.email = email;
        req.session.avatar = avatar;
        req.session.save();

        res.redirect("/");
    } catch (err) {
        logger.error(err);
        internalError(res, "Internal Server Error, discord auth failed!");
    }
});

router.get("/logout", userCheck, (req, res) => req.session.destroy(() => res.redirect("/")));

router.get("/session", userCheck, async (req, res) => {
    const { userid, tag, username, email, avatar } = req.session;

    if (!userid) return unauthorized(res, "No userid provided");

    res.json({
        code: 200,
        message: "OK",
        user: {
            userid,
            tag,
            username,
            email,
            avatar,
        },
    });
});

router.get("/stats", userCheck, async (req, res) => {
    const { userid } = req.session;

    if (!userid) return unauthorized(res, "No userid provided");

    if (!userCache[userid] || timeSince(userCache[userid].date) > 3600) {
        const response = await req.core.database.players.getUserFromServer(userid);

        if (response) {
            if (response.length == 0) return notFound(res, "User not found in database");

            // @ts-expect-error this is always good good to go fuck you eslint
            const user: DBUser = Object.assign(response[0], response.reduce((first, second) => ({ kills: first.kills + second!.kills, deaths: first.deaths + second!.deaths, heady: first.heady + second!.heady }), { kills: 0, deaths: 0, heady: 0 }));

            if (user === null) return internalError(res, "Database error");

            const { discord, identifier, license, heady, kills, deaths } = user;

            const { playTime } = req.core.database.players.get(license);
            userCache[userid] = {
                discord,
                license,
                heady,
                kills,
                deaths,
                identifier,
                playTime,
                date: new Date(),
            };
        } else {
            userCache[userid] = {
                discord: userid,
                license: undefined,
                heady: undefined,
                kills: undefined,
                deaths: undefined,
                identifier: undefined,
                playTime: 0,
                rank: undefined,
                date: new Date(),
            };
        }
    }

    res.json({
        code: 200,
        message: "OK",
        user: userCache[userid],
    });
});

export default router;
