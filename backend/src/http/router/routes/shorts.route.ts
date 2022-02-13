import { NextFunction, Request, Response, Router } from "express";
const router = Router();

const adminCheck = (req: Request, res: Response, next: NextFunction) => {
	const { userid } = req.session;

	if (!userid) return res.send("500");

	const settings = req.core.database.settings;
	const fetchedUser = settings.getUser(userid);

	if (!fetchedUser)
		return res.status(401).json({
			code: 401,
			message: "Unauthorized",
		});
	else {
		if (settings.hasPermission(userid, "MANAGE_SHORTS")) next();
		else {
			res.status(401).json({
				code: 5001,
				message: "You dont have permissions to this",
			});
		}
	}
};

router.post("/create", adminCheck, async (req, res) => {
	const { userid } = req.session;
	const { url } = req.body;

	if (!userid) return res.send("500");

	if (!url)
		return res.status(400).json({
			code: 400,
			message: "Missing 'url'",
		});

	const document = await req.core.database.shorts.create({
		author: userid,
		url,
	});

	res.json({
		code: 200,
		message: "Ok!",
		shortID: document.shortID,
	});
});

export default router;
