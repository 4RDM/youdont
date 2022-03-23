import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
	res.json({
		code: 200,
		message: "Ok!",
		articles: [{
			title: "Wpłata na serwer",
			description: "Krótki artykuł wyjaśniający wszystko co musisz wiedzieć przed/po wpłąceniu dotacji na serwer.",
			author: {
				nickname: "Kubamaz",
				avatar: "https://cdn.discordapp.com/avatars/594526434526101527/a_c1af0e5c48ff435a49da731b412d0c63.webp?size=96"
			},
			id: "1",
			views: 100,
			createDate: new Date(),
		}]
	});
});

router.get("/:id", (req, res) => {
	res.json({
		code: 200,
		message: "Ok!",
		article: {
			title: "Wpłata na serwer",
			content: "# Witaj świecie!\n\nCześć co u ciebie?\n\n![Lorem ipsum](https://4rdm.pl/public/assets/logo.png)",
			author: {
				nickname: "Kubamaz",
				avatar: "https://cdn.discordapp.com/avatars/594526434526101527/a_c1af0e5c48ff435a49da731b412d0c63.webp?size=96"
			},
			createDate: new Date(),
		}
	});
});

export default router;
