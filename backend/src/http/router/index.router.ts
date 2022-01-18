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

	res.send("Hello World!") // TODO: add SPA here
})

export default router
