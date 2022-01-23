import { NextFunction, Request, Response, Router } from "express"
import { join } from "path"
import multer from "multer"
import { stat, unlinkSync } from "fs"

const router = Router()
const temp = join(__dirname, "..", "..", "..", "..", "temp")
const upload = multer({ dest: temp })

const adminCheck = (req: Request, res: Response, next: NextFunction) => {
	const { userid } = <any>req.session
	const settings = req.core.database.settings
	const fetchedUser = settings.getUser(userid)

	if (!fetchedUser)
		return res.status(401).json({
			code: 401,
			message: "Unauthorized",
		})
	else {
		if (settings.hasPermission(userid, "MANAGE_FILES")) next()
		else {
			res.status(401).json({
				code: 5001,
				message: "You dont have permissions to this",
			})
		}
	}
}

router.post("/upload", adminCheck, upload.single("file"), (req, res) =>
	res.json({
		code: 200,
		message: `${req.file?.filename} - ${req.file?.size}`,
	})
)

router.delete("/delete", adminCheck, (req, res) => {
	const { file } = req.body

	if (!file)
		return res.status(400).json({
			code: 400,
			message: "Missing 'file'",
		})

	unlinkSync(join(temp, file))
})

export default router
