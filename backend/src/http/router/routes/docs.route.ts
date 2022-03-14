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
		if (settings.hasPermission(userid, "MANAGE_DOCS")) next();
		else {
			res.status(401).json({
				code: 5001,
				message: "You dont have permissions to this",
			});
		}
	}
};

router.get("/docs", adminCheck, async (req, res) => {
	const fetched = (await req.core.database.docs.getAll()) || [];
	res.json({ code: 200, message: "Ok!", data: fetched });
});

router.get("/user/all", async (req, res) => {
	const docs = await req.core.database.docs.getAllUser(req.session.userid || "000");
	res.json({
		code: 200,
		message: "OK",
		data: docs || [],
	});
});

router.get("/doc/:id", adminCheck, async (req, res) => {
	const { id } = req.params;

	if (!id) return res.json({ code: 400, message: "Missing 'id'." });

	const fetched = await req.core.database.docs.get(id);

	if (!fetched)
		return res.json({
			code: 404,
			message: `Cannot found doc with ID '${id}'`,
		});

	const { author, nick, age, voice, long, short, steam, docID } = fetched;

	res.json({
		code: 200,
		message: "Ok!",
		data: {
			author,
			nick,
			age,
			voice,
			long,
			short,
			steam,
			docID,
		},
	});
});

router.delete("/doc/:id", adminCheck, async (req, res) => {
	const { id } = req.params;

	if (!id) return res.json({ code: 400, message: "Missing 'id'." });

	const removed = await req.core.database.docs.remove(id);

	res.json({ code: 200, message: "Ok!", author: removed?.author });
});

router.post("/doc/:id/accept", adminCheck, (req, res) => {});
router.post("/doc/:id/reject", adminCheck, (req, res) => {});
router.get("/publish", adminCheck, (req, res) => {});

router.put("/upload", async (req, res) => {
	const { author, nick, age, voice, long, short, steam } = req.body;

	if (!nick || !author || !steam || !age || !short || !long)
		return res.json({ code: 1, message: 1 });
	if (long.length < 200) return res.json({ code: 1, message: 2 });
	if (short.length < 30) return res.json({ code: 1, message: 3 });
	if (age < 12 || age > 99) return res.json({ code: 1, message: 4 });
	if (nick.length == 0 || nick !== req.session.username)
		return res.json({ code: 1, message: 5 });
	if (author.length == 0 || author !== req.session.userid)
		return res.json({ code: 1, message: 6 });
	if (steam.length < "https://steamcommunity.com/".length)
		return res.json({ code: 1, message: 7 });

	const doc = await req.core.database.docs.create({
		author,
		nick,
		age,
		voice,
		long,
		short,
		steam,
	});

	res.json({ code: 200, message: "Ok!", docID: doc?.docID });
});

export default router;
