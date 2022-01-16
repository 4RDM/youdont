import { NextFunction, Request, Response, Router } from "express"
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
const adminCheck = (req: Request, res: Response, next: NextFunction) => {
	const { userid } = <any>req.session
	const user = req.core.bot.guilds.cache
		.get("843444305149427713")
		?.members.cache.get(userid)
		?.roles.cache.has("855159545290424330")

	if (user) next()
	else
		res.status(401).json({
			code: 401,
			message: "Unauthorized, not admin",
		})
}

router.use(userCheck)

/*
	* /api/docs/docs
	! Pobiera wszystkie podania
*/
router.get("/docs", adminCheck, (req, res) => {
	res.send("Hello Json!")
})

/*
	* /api/docs/doc/1234
	! Pobiera podanie o :ID
*/
router.get("/doc/:id", adminCheck, (req, res) => {})

/*
	* /api/docs/doc/1234
	! Usuwa podanie o :ID
*/
router.delete("/doc/:id", adminCheck, (req, res) => {})

/*
	* /api/docs/doc/1234/accept
	! Akceptuje podanie o :ID
*/
router.post("/doc/:id/accept", adminCheck, (req, res) => {})

/*
	* /api/docs/doc/1234/reject
	! Odrzuca podanie o :ID

	?{
	?	reason: string
	?}
*/
router.post("/doc/:id/reject", adminCheck, (req, res) => {})

/*
	* /api/docs/publish
	! Publikuje wyniki
*/
router.get("/publish", adminCheck, (req, res) => {})

/*
	* /api/docs/upload
	! Złóż podanie do sprawdzenia

	?{
	?	userTag: string
	?	userID: string
	?	userSteam: string
	?	userAge: int
	?	shortDescription: string
	?	longDescription: string
	?}
*/
router.put("/upload", (req, res) => {})

export default router
