import {
	NextFunction,
	Request,
	Response,
	Router,
	static as staticFiles,
} from "express"
import { existsSync } from "fs"
import { join } from "path"

const router = Router()
const publicPath = join(__dirname, "..", "..", "..", "..", "frontend", "dist")

const spaHandler = async (req: Request, res: Response, next: NextFunction) => {
	// URL shortener
	if (req.query.r) {
		const url = await req.core.database.shorts.get(<string>req.query.r)

		if (url) res.redirect(url)
		else res.status(404).json({ code: 404, message: "Not Found" })

		return
	}

	if (existsSync(publicPath)) {
		res.sendFile(join(publicPath, "index.html"))
	} else {
		res.send(
			"<h1>Błąd serwera, skontaktuj się z administratorem strony</h1>"
		)
	}
}

router.use(staticFiles(join(publicPath, "public")))
router.use(staticFiles(join(publicPath, "data")))
router.get(
	["/", "/articles", "/article/:id", "/panel", "/administration"],
	spaHandler
)

export default router
