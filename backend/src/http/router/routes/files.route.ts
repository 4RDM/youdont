import { NextFunction, Request, Response, Router } from "express"
import { join } from "path"
import multer from "multer"
import { existsSync, readdirSync, unlinkSync } from "fs"

const router = Router()
const temp = join(__dirname, "..", "..", "..", "..", "..", "temp")

const storage = multer.diskStorage({
	destination: (req, file, call) => call(null, temp),
	filename: (req, file, call) =>
		// prettier-ignore
		call(null, Math.floor(Math.random() * 50000).toString() + new Date().getTime() + "-" + file.originalname),
})
const upload = multer({ storage })

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

router.get("/", adminCheck, (req, res) =>
	res.render(join(__dirname, "filebrowser.ejs"), {
		files: readdirSync(temp),
	})
)

router.post("/upload", adminCheck, upload.array("file"), (req, res) => {
	if (!req.files) return
	res.json({
		code: 200,
		message: `OK`,
		// @ts-ignore
		files: req.files.map((file: any) => file.filename),
	})
})

router.get("/:id", adminCheck, (req, res) => {
	const { id } = req.params

	if (!existsSync(join(temp, id)))
		return res.status(404).json({
			code: 404,
			message: "File not found",
		})
	res.sendFile(join(temp, id))
})

router.delete("/:id", adminCheck, (req, res) => {
	const { id } = req.params

	if (!existsSync(join(temp, id)))
		return res.status(404).json({
			code: 404,
			message: "File not found",
		})
	unlinkSync(join(temp, id))

	res.json({
		code: 200,
		message: "OK",
	})
})

export default router
