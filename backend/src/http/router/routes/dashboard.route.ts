import { NextFunction, Request, Response, Router } from "express";
import FormData from "form-data";
import fetch from "node-fetch";
import logger from "../../../utils/logger";
import config from "../../../config";
import timeSince from "../../../utils/timeSince";
import { getHighestRole } from "../../../utils/users";
import { GuildMember, User } from "discord.js";

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

interface IAdmin {
	roles: {
		[index: string]: [
			{
				nickname: string;
				avatar: string;
				id: string;
			}?
		];
	};
	lastFetched: Date;
}

const router = Router();
const userCache: IUserCache = {};
let AdminCache: IAdmin = { roles: {}, lastFetched: new Date(0) };

const userCheck = (req: Request, res: Response, next: NextFunction) => {
	const { username, tag, userid, email } = req.session;
	if (username && tag && userid && email) next();
	else
		res.status(401).json({
			code: 401,
			message: "Unauthorized, not logged in",
		});
};

router.get("/admins", async (req, res) => {
	if (req.core.bot.isReady()) {
		if (timeSince(AdminCache.lastFetched) > 3600) {
			AdminCache = { roles: {}, lastFetched: new Date() };

			const members: GuildMember[] = [];

			await new Promise((resolve, reject) => {
				const users = [
					"913946327254183947", // yenn
					"932638518449172520", // Wedel
					"530495771074887701", // Shinra
					"735152195993075722", // PUDZIAN
					"565156308429570070", // PABLITO
					"364056796932997121", // NIMPLEX
					"423865728463273984", // LUCKY
					"451050486712369163", // LAMA
					"799596081549279253", // Klaudyna
					"598148434863849506", // KapitanKuba
					"413295283322093570", // Kaliberek
					"482576133322178570", // Kaktus_X
					"850067911237697547", // KAJO111
					"594526434526101527", // K3IX
					"528212334670249996", // IGI
					"725095334279381073", // Hydrant
					"427240221197729792", // Helix_
					"530438225026613248", // Donki Kong
					"913847104747761765", // DejvideK
					"737250240763265064", // DamianJakisTam
					"650715268976476200", // Chubby
					"497854466427715615", // Black_Dog
					"828550270455250945", // Betkal
					"688094519652253739", // Bambix
					"420220391823245314", // Adrianito
					"919162480700301323", // .exe
				];
				users.forEach(async (member) => {
					const mem = await req.core.bot.guilds.cache.get("843444305149427713")?.members.fetch(member);
					if (!mem) return;
					members.push(mem);
					if (users.length == members.length) resolve("");
				});
			});

			members.forEach(member => {
				const role = getHighestRole(member.roles.cache);
				/* prettier-ignore */
				if (!AdminCache.roles[role.name]) AdminCache.roles[role.name] = [];
				AdminCache.roles[role.name].push({
					nickname: member.user.tag,
					id: member.user.id,
					avatar: member.user.displayAvatarURL({
						dynamic: true,
						size: 1024,
						format: "webp",
					}),
				});
			});
		}
		res.json({
			code: 200,
			message: "OK",
			admins: {
				roles: {
					Właściciel: AdminCache.roles["Właściciel"],
					Zarząd: AdminCache.roles["Zarząd"],
					"Head Admin": AdminCache.roles["Head Admin"],
					Admin: AdminCache.roles["Admin"],
					Moderator: AdminCache.roles["Moderator"],
					Support: AdminCache.roles["Support"],
					"Trial Support": AdminCache.roles["Trial Support"],
				},
			},
		});
	} else {
		res.json({
			code: 200,
			message: "OK",
		});
	}
});

router.get("/login", (req, res) => {
	res.redirect(
		`https://discord.com/api/oauth2/authorize?client_id=${config.discord.id}&redirect_uri=${config.discord.redirect}&response_type=code&scope=email%20identify`
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
		.then(json =>
			fetch("https://discord.com/api/users/@me", {
				method: "GET",
				headers: {
					authorization: `${json.token_type} ${json.access_token}`,
				},
			})
				.then(b => b.json())
				.then(async ures => {
					// prettier-ignore
					const { email, avatar, discriminator, username, id } = ures;
					if (!email || !avatar || !discriminator || !username || !id)
						return res.send("Missing auth field");

					if (ures.code == 0)
						return res.json({
							code: 401,
							message: "Discord returned an error",
						});
					req.session.username = username;
					req.session.userid = id;
					req.session.tag = discriminator;
					req.session.email = email;
					req.session.avatar = avatar;

					res.redirect("/");
				}).catch(() => logger.error("Unable to handshake with https://discord.com (src/http/router/routes/dashboard.route"))
		).catch(() => logger.error("Unable to handshake with https://discord.com (src/http/router/routes/dashboard.route"));
});

// prettier-ignore
router.get("/logout", userCheck, (req, res) => req.session.destroy(() => res.redirect("/")));

router.get("/session", userCheck, async (req, res) => {
	const { userid, tag, username, email, avatar } = req.session;

	if (!userid) return;
	const permissions = req.core.database.settings.getUser(userid)?.permissions || [];

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
			applicationState: req.core.database.settings.get<boolean>("docsOpen"),
			role: role || "Członek",
		},
		permissions,
	});
});

router.get("/stats", userCheck, async (req, res) => {
	const { userid } = req.session;

	if (!userid) return;

	if (!userCache[userid] || timeSince(userCache[userid].date) > 3600) {
		const response = await req.core.database.users.getUserFromServer(userid);

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
