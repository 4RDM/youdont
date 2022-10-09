import { NextFunction, Request, Response, Router } from "express";
import { badRequest, unauthorized } from "../errors";
const router = Router();

const adminCheck = (req: Request, res: Response, next: NextFunction) => {
	const { userid } = req.session;

	if (!userid) return res.send("500");

	const settings = req.core.database.settings;
	const fetchedUser = settings.getUser(userid);

	if (!fetchedUser)
		return unauthorized(res);
	else {
		if (settings.hasPermission(userid, "MANAGE_SHORTS")) next();
		else unauthorized(res);
	}
};

router.post("/create", adminCheck, async (req, res) => {
	const { userid } = req.session;
	const { url } = req.body;

	if (!userid) return res.send("500");

	if (!url)
		return badRequest(res, "Bad request, missing 'url' field.");

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
