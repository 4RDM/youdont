import { NextFunction, Request, Response, Router } from "express";
import { badRequest, internalError, notFound, unauthorized } from "../errors";
const router = Router();

const adminCheck = (req: Request, res: Response, next: NextFunction) => {
	const { userid } = req.session;

	if (!userid)
		return unauthorized(res);

	const settings = req.core.database.settings;
	const fetchedUser = settings.getUser(userid);

	if (!fetchedUser)
		return unauthorized(res);
	else
		if (settings.hasPermission(userid, "MANAGE_ARTICLES")) next();
		else return unauthorized(res);
};

router.get("/", async (req, res) => {
	res.json({
		code: 200,
		articles: await req.core.database.articles.getAll()
	});
});

router.get("/:id", async (req, res) => {
	const { id } = req.params;
	const article = await req.core.database.articles.get(id);

	if (!article)
		return notFound(res);

	res.json({ code: 200, article });
});

router.post("/create", adminCheck, async (req, res) => {
	const { title, description, content, id } = req.body;

	if (!title || !description || !content || !id)
		return badRequest(res, "Missing body");

	if (!req.session.username || !req.session.avatar) {
		req.session.destroy(() => {});

		return badRequest(res, "Invalid session, destroying");
	}

	const article = await req.core.database.articles.create({
		title,
		description,
		content,
		id,
		createDate: new Date(),
		author: {
			nickname: req.session.username,
			avatar: `https://cdn.discordapp.com/avatars/${req.session.userid}/${req.session.avatar}`,
		},
		views: 0
	});

	res.json({ code: 200, article });
});

router.post("/update", adminCheck, async (req, res) => {
	const { title, content, description, id, originalID } = req.body;
	if (!title || !content || !description || !id || !originalID) return res.json({ code: 500, message: "Can't update" });

	const update = await req.core.database.articles.update(originalID, {
		title, description, content, id,
		author: {
			nickname: req.session.username || "",
			avatar: `https://cdn.discordapp.com/avatars/${req.session.userid}/${req.session.avatar}`,
		},
	});

	if (!update)
		return internalError(res);

	res.json({ code: 200 });
});

router.delete("/delete", adminCheck, async (req, res) => {
	const { id } = req.body;
	if (!id)
		return internalError(res);

	const update = await req.core.database.articles.delete(id);

	if (!update)
		return internalError(res);

	res.json({ code: 200 });
});

export default router;
