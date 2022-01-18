import { NextFunction, Request, Response, Router } from "express"
import FormData from "form-data"
import fetch from "node-fetch"
import config from "../../../config"

const router = Router()

const userCheck = (req: Request, res: Response, next: NextFunction) => {
	const { username, tag, userid, email } = <any>req.session
	if (username && tag && userid && email) next()
	else
		res.status(401).json({
			code: 401,
			message: "Unauthorized, not logged in",
		})
}

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

router.get("/session", userCheck, (req, res) => {})

export default router
