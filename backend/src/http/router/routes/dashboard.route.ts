import { NextFunction, Request, Response, Router } from "express";
import FormData from "form-data";
import fetch from "node-fetch";
import logger from "../../../utils/logger";
import config from "../../../config";
import timeSince from "../../../utils/timeSince";

const mainGuild = "843444305149427713";

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
	};
}

const router = Router();
const userCache: IUserCache = {};

const userCheck = (req: Request, res: Response, next: NextFunction) => {
	const { username, tag, userid, email } = req.session;
	if (username && tag && userid && email) next();
	else
		res.status(401).json({
			code: 401,
			message: "Unauthorized, not logged in",
		});
};

router.get("/login", (req, res) => {
	res.redirect(
		`https://discord.com/api/oauth2/authorize?client_id=${config.discord.id}&redirect_uri=${config.discord.redirect}&response_type=code&scope=email%20identify%20guilds.join`
	);
});

router.get("/reply", (req, res) => {
	const code = <string | undefined>req.query.code;

	if (!code) return res.send("Unauthorized");

	const form = new FormData();
	form.append("client_id", config.discord.id);
	form.append("client_secret", config.discord.secret);
	form.append("redirect_uri", config.discord.redirect);
	form.append("grant_type", "authorization_code");
	form.append("code", code);

	fetch("https://discord.com/api/oauth2/token", {
		method: "POST",
		body: form,
	})
		.then(a => a.json())
		.then(json => {
			fetch("https://discord.com/api/users/@me", {
				method: "GET",
				headers: {
					authorization: `${json.token_type} ${json.access_token}`,
				},
			})
				.then(b => b.json())
				.then(async ures => {
					const { email, avatar, discriminator, username, id } = ures;
					if (!email || !avatar || !discriminator || !username || !id)
						return res.send("Missing auth field");
					if (ures.code == 0)
						return res.json({
							code: 401,
							message: "Discord returned an error",
						});

					fetch(
						`https://discord.com/api/guilds/${mainGuild}/members/${id}`,
						{
							body: JSON.stringify({
								access_token: json.access_token,
							}),
							headers: {
								authorization: `Bot ${config.discord.token}`,
								"Content-Type": "application/json",
							},
							method: "PUT",
						}
					).catch();

					req.session.username = username;
					req.session.userid = id;
					req.session.tag = discriminator;
					req.session.email = email;
					req.session.avatar = avatar;

					res.redirect("/");
				})
				.catch(() =>
					logger.error(
						"Unable to handshake with https://discord.com (src/http/router/routes/dashboard.route)"
					)
				);
		})
		.catch(() =>
			logger.error(
				"Unable to handshake with https://discord.com (src/http/router/routes/dashboard.route)"
			)
		);
});

// prettier-ignore
router.get("/logout", userCheck, (req, res) => req.session.destroy(() => res.redirect("/")));

router.get("/session", userCheck, async (req, res) => {
	const { userid, tag, username, email, avatar } = req.session;

	if (!userid) return;

	const role = (await req.core.database.users.get(userid))?.role;

	res.json({
		code: 200,
		message: "OK",
		user: {
			userid,
			tag,
			username,
			email,
			avatar,
			role: role || "Członek",
		},
	});
});

router.get("/stats", userCheck, async (req, res) => {
	const { userid } = req.session;

	if (!userid) return;

	if (!userCache[userid] || timeSince(userCache[userid].date) > 3600) {
		const response = await req.core.database.users.getUserFromServer(
			userid
		);

		if (response) {
			const { discord, identifier, license, kills, deaths, heady } =
				response;
			const { playTime } = req.core.database.playerData.getUser(license);
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
				date: new Date(),
			};
		}
	}

	res.json({
		code: 200,
		message: "OK",
		...userCache[userid],
	});
});

export default router;
