import {
	Router,
	json,
	urlencoded,
	NextFunction,
	Request,
	Response,
} from "express"

import docsRouter from "./routes/docs.route"
import dashboardRouter from "./routes/dashboard.route"
import shortsRouter from "./routes/shorts.route"

const router = Router()

const userCheck = (req: Request, res: Response, next: NextFunction) => {
	const { username, tag, userid, email } = <any>req.session
	if (username && tag && userid && email) next()
	else
		res.status(401).json({
			code: 401,
			message: "Log in first.",
		})
}

router.use(json())
router.use(urlencoded({ extended: true }))

router.use("/docs", userCheck, docsRouter)
router.use("/shorts", userCheck, shortsRouter)
router.use("/dashboard", dashboardRouter)

router.get("/*", (req, res) =>
	res
		.status(404)
		.json({ code: 404, message: `Unknown endpoint: ${req.path}` })
)

export default router
