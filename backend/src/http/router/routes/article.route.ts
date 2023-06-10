import { NextFunction, Request, Response, Router } from "express";
import { badRequest, internalError, notFound, unauthorized } from "../errors";
import rateLimit from "express-rate-limit";

const router = Router();

// prettier-ignore
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: true,
	skip: req => {
		if (req.skip) {
			req.skip = false;
			return true;
		} else return false;
	},
});

// prettier-ignore
const adminCheck = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { userid } = req.session;
		if (!userid) return unauthorized(res, "No session found");

		const guild = await req.core.bot.guilds.fetch(req.core.bot.config.discord.mainGuild);
		if (!guild) return internalError(res, "MainGuild not found (ERROR CODE: ARTICLE_CONFIG_MAIN_GUILD_NOT_FOUND)");

		const user = await guild.members.fetch(userid);
		if (!user) return unauthorized(res, "User not found in main guild (ERROR CODE: ARTICLE_USER_NOT_IN_MAIN_GUILD)");
	
		if (user.roles.cache.has("ADMINISTRATOR")) {
			req.skip = true;
			next();
		}
		else {
			unauthorized(res);
		}
	} catch (err) {
		internalError(res);
	}
};

router.get("/", async (req, res) => {
	res.json({
		code: 200,
		articles: (await req.core.database.articles.getAll()) || [],
	});
});

router.get("/:id", async (req, res) => {
	const { id } = req.params;
	const article = await req.core.database.articles.getByURL(id);

	if (!article) return notFound(res);

	res.json({ code: 200, article });
});

router.post("/create", adminCheck, limiter, async (req, res) => {
	if (!req.body) return badRequest(res, "Missing body");
	if (!req.session) return unauthorized(res);

	const { title, content, description, url } = req.body;

	if (!title || !content || !description || !url)
		return res.json({
			code: 400,
			message:
				"Missing parameters, { title: string, content: string, description: string, id: number, url: string }",
			body: req.body,
		});

	const article = await req.core.database.articles.create({
		title,
		articleDescription: description,
		content,
		articleURL: url,
		discordID: req.session.userid || "0",
	});

	res.json({ code: 200, article });
});

router.post("/update", adminCheck, limiter, async (req, res) => {
	if (!req.body) return badRequest(res, "Missing body");
	if (!req.session) return unauthorized(res);

	const { title, content, description, id, url } = req.body;

	if (!title || !content || !description || !id || !url)
		return res.json({
			code: 500,
			message:
				"Missing parameters, { title: string, content: string, description: string, id: number, url: string }",
			body: req.body,
		});

	const update = await req.core.database.articles.update(id, {
		title,
		articleDescription: description,
		content,
		articleURL: url,
		discordID: req.session.userid || "0",
	});

	if (!update) return internalError(res);

	res.json({ code: 200 });
});

router.delete("/delete", adminCheck, limiter, async (req, res) => {
	const { id } = req.body;
	if (!id) return internalError(res);

	const update = await req.core.database.articles.delete(id);

	if (!update) return internalError(res);

	res.json({ code: 200 });
});

export default router;
