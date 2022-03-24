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
		if (settings.hasPermission(userid, "MANAGE_ARTICLES")) next();
		else {
			res.status(401).json({
				code: 5001,
				message: "You dont have permissions to this",
			});
		}
	}
};

router.get("/", async (req, res) => {
	res.json({
		code: 200,
		message: "Ok!",
		articles: await req.core.database.articles.getAll()
	});
});

router.get("/:id", async (req, res) => {
	const { id } = req.params;
	const article = await req.core.database.articles.get(id);

	if (!article) res.json({
		code: 404,
		message: "Not found article"
	});

	res.json({
		code: 200,
		message: "Ok!",
		article
	});
});

router.post("/create", adminCheck, async (req, res) => {
	const { title, description, content, id } = req.body;

	if (!title || !description || !content || !id) return res.status(400).json({
		code: 400,
		message: "Missing body",
	});

	if (!req.session.username || !req.session.avatar) return res.status(400).json({
		code: 400,
		message: "Missing avatar or nickname",
	});

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

	res.json({
		code: 200,
		message: "Ok!",
		article
	});
});

export default router;
