import { Router } from "express"

const router = Router()

router.get("/", async (req, res) => {
	// URL shortener
	if (req.query.r) {
		const url = await req.core.database.shorts.get(<string>req.query.r)

		if (url) res.redirect(url)
		else res.status(404).json({ code: 404, message: "Not Found" })

		return
	}

	res.send("Hello World!")

	// @ts-ignore
	// just for testing core in request
	// const channel = req.core.bot.channels.cache.get("843444766187847690")
	// if (channel?.isText()) channel.send("Hello World!")
})

router.get("/test", async (req, res) => {
	const document = await req.core.database.shorts.create({
		author: "364056796932997121",
		url: "https://nimplex.xyz",
	})

	res.send(document.shortID)
})

export default router
