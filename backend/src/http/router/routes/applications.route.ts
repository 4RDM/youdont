import { NextFunction, Request, Response, Router } from "express";
const router = Router();

const regex = /(?:https?:\/\/)?steamcommunity\.com\/(?:profiles|id)\/[a-zA-Z0-9]+/gm;

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

router.get("/switchstate", adminCheck, async (req, res) => {
	req.core.database.settings.set("docsOpen", !req.core.database.settings.get<boolean>("docsOpen"));
	res.json({ code: 200, message: "Ok!" });
});

router.get("/applications", adminCheck, async (req, res) => {
	const fetched = (await req.core.database.docs.getAllActive()) || [];
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

router.get("/application/:id", adminCheck, async (req, res) => {
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

router.delete("/application/:id", adminCheck, async (req, res) => {
	const { id } = req.params;

	if (!id) return res.json({ code: 400, message: "Missing 'id'." });

	const removed = await req.core.database.docs.remove(id);

	req.core.httpServer.wssclients.forEach((c) => c.send("UPDATE"));
	res.json({ code: 200, message: "Ok!", author: removed?.author });
});

router.post("/application/:id/accept", adminCheck, async (req, res) => {
	const { id } = req.params;
	if (!req.session.username) return res.json({ code: 400, message: "Bad request" });
	await req.core.database.docs.changeState(id, true, req.session.username, "");

	req.core.httpServer.wssclients.forEach((c) => c.send("UPDATE"));
	return res.json({ code: 200, message: "Ok!" });
});

router.post("/application/:id/reject", adminCheck, async (req, res) => {
	const { id } = req.params;
	const { reason } = req.body;
	if (!req.session.username || !reason) return res.json({ code: 400, message: "Bad request" });
	await req.core.database.docs.changeState(id, false, req.session.username, reason);

	req.core.httpServer.wssclients.forEach((c) => c.send("UPDATE"));
	return res.json({ code: 200, message: "Ok!" });
});

router.get("/application/:id/revert", adminCheck, async (req, res) => {
	const { id } = req.params;

	if (!req.session.username) return res.json({ code: 400, message: "Bad request" });
	const response = await req.core.database.docs.revert(id);

	if (!response) return res.json({ code: 400, message: "Cannot find active application with provided ID" });

	req.core.httpServer.wssclients.forEach((c) => c.send("UPDATE"));
	return res.json({ code: 200, message: "Ok!" });
});

router.get("/publish", adminCheck, async (req, res) => {
	if (!req.session.userid) return;
	await req.core.database.docs.publishResults(req.session.userid);
	req.core.httpServer.wssclients.forEach((c) => c.send("UPDATE"));
});

router.post("/upload", async (req, res) => {
	if (!req.core.database.settings.get<boolean>("docsOpen")) return res.json({ code: 403, message: "Applications are closed" });

	const { author, nick, age, voice, long, short, steam } = req.body;

	const user = (await req.core.database.docs.getAllUser(author))?.filter(x => x.active);
	if (user && user.length >= 2) return res.json({ code: 400, message: "Too many active docs" });

	if (!nick || !author || !steam || !age || !short || !long)
		return res.json({ code: 400, message: "Missing request fields" });

	const problems = [];

	if (long.length < 200) problems.push("long");
	if (short.length < 30) problems.push("short");
	if (age < 12 || age > 99) problems.push("age");
	if (nick !== `${req.session.username}#${req.session.tag}`) problems.push("nick");
	if (author !== req.session.userid) problems.push("discord");
	// if (!test) problems.push("steam");

	if (problems.length !== 0) return res.json({ code: 400, message: "Bad request", problems });

	const doc = await req.core.database.docs.create({
		author,
		nick,
		age,
		voice,
		long,
		short,
		steam,
	});

	req.core.httpServer.wssclients.forEach((c) => c.send("UPDATE"));
	res.json({ code: 200, message: "Ok!", docID: doc?.docID });
});

export default router;
