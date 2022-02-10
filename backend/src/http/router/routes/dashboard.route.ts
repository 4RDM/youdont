import { NextFunction, Request, Response, Router } from "express"
import FormData from "form-data"
import fetch from "node-fetch"
import mariadb from "mariadb"
import config from "../../../config"
import timeSince from "../../../utils/timeSince"
import { AdministratorRole, getHighestRole } from "../../../utils/users"

interface IUserCache {
	[index: string]: {
		identifier?: string
		license?: string
		discord?: string
		deaths?: number
		heady?: number
		kills?: number
		date?: Date
	}
}

interface IUser {
	identifier: string
	license: string
	discord: string
	deaths: number
	heady: number
	kills: number
}

interface IAdmin {
	admins: [
		{
			nickname: string
			avatar: string
			id: string
			role: AdministratorRole
		}?
	]
	lastFetched: Date
}

type user = null | IUser

const router = Router()
let userCache: IUserCache = {}
let AdminCache: IAdmin = {
	admins: [],
	lastFetched: new Date(0),
}

const userCheck = (req: Request, res: Response, next: NextFunction) => {
	const { username, tag, userid, email } = <any>req.session
	if (username && tag && userid && email) next()
	else
		res.status(401).json({
			code: 401,
			message: "Unauthorized, not logged in",
		})
}

router.get("/admins", (req, res) => {
	if (req.core.bot.isReady()) {
		if (timeSince(AdminCache.lastFetched) > 3600) {
			AdminCache = {
				admins: [],
				lastFetched: new Date(),
			}
			// prettier-ignore
			req.core.bot.guilds.cache.get("843444305149427713")?.roles.cache.get("843444642539110400")?.members.forEach(member => { AdminCache.admins.push({ nickname: member.user.tag, id: member.user.id, avatar: member.user.displayAvatarURL({ dynamic: true, size: 1024, format: "webp" }), role: getHighestRole(member.roles.cache), }) })
			// prettier-ignore
			AdminCache.admins = AdminCache.admins.sort((a, b) => (b?.role.rarity || 0) - (a?.role.rarity || 0))
		}
		res.json({
			code: 200,
			message: "OK",
			admins: AdminCache,
		})
	} else {
		res.json({
			code: 200,
			message: "OK",
		})
	}
})

router.get("/login", (req, res) => {
	res.redirect(
		`https://discord.com/api/oauth2/authorize?client_id=${config.discord.id}&redirect_uri=${config.discord.redirect}&response_type=code&scope=email%20identify`
	)
})

router.get("/reply", (req, res) => {
	const code = <string | undefined>req.query.code

	if (!code) return res.send("Unauthorized")

	const form = new FormData()
	form.append("client_id", config.discord.id)
	form.append("client_secret", config.discord.secret)
	form.append("redirect_uri", config.discord.redirect)
	form.append("grant_type", "authorization_code")
	form.append("code", code)

	fetch("https://discord.com/api/oauth2/token", {
		method: "POST",
		body: form,
	})
		.then(a => a.json())
		.then((json: any) =>
			fetch("https://discordapp.com/api/users/@me", {
				method: "GET",
				headers: {
					authorization: `${json.token_type} ${json.access_token}`,
				},
			})
				.then(b => b.json())
				.then(async (ures: any) => {
					// prettier-ignore
					const { email, avatar, discriminator, username, id } = ures
					if (!email || !avatar || !discriminator || !username || !id)
						return res.send("Missing auth field")

					if (ures.code == 0)
						return res.json({
							code: 401,
							message: "Discord returned an error",
						})
					req.session.username = username
					req.session.userid = id
					req.session.tag = discriminator
					req.session.email = email
					req.session.avatar = avatar

					res.redirect("/")
				})
		)
})

// prettier-ignore
router.get('/logout', userCheck, (req, res) => req.session.destroy(() => res.redirect('/')))

router.get("/session", userCheck, (req, res) => {
	const { userid, tag, username, email, avatar } = req.session
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
	})
})

router.get("/stats", userCheck, async (req, res) => {
	const { userid } = req.session

	if (!userid) return

	if (!userCache[userid] || timeSince(userCache[userid].date) > 3600) {
		const connection = await mariadb.createConnection({
			host: config.mysql.host,
			user: config.mysql.user,
			password: config.mysql.password,
			database: "rdm",
			allowPublicKeyRetrieval: true,
		})

		const response: user = (
			await connection.query(
				`SELECT * FROM kdr WHERE \`discord\` = '${userid}'`
			)
		)[0]

		if (response) {
			const { discord, identifier, license, kills, deaths, heady } =
				response
			userCache[userid] = {
				discord,
				license,
				heady,
				kills,
				deaths,
				identifier,
				date: new Date(),
			}
		} else {
			userCache[userid] = {
				discord: userid,
				license: undefined,
				heady: undefined,
				kills: undefined,
				deaths: undefined,
				identifier: undefined,
				date: new Date(),
			}
		}
	}

	res.json({
		code: 200,
		message: "OK",
		...userCache[userid],
	})
})

export default router
