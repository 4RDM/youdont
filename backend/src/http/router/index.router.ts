import { Router } from "express"
const router = Router()

router.get("/", (req, res) => {
	res.send("Hello World!")

	// @ts-ignore
	// const channel = req.core.bot.channels.cache.get("843444766187847690")
	// if (channel?.isText()) channel.send("Hello World!")
})

export default router
