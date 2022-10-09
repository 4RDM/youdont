import {
	Router,
	json,
	urlencoded,
	NextFunction,
	Request,
	Response,
} from "express";

import dashboardRouter from "./routes/dashboard.route";
import shortsRouter from "./routes/shorts.route";
import articleRouter from "./routes/article.route";

const router = Router();

const userCheck = (req: Request, res: Response, next: NextFunction) => {
	const { username, tag, userid, email } = req.session;
	if (username && tag && userid && email) next();
	else
		res.status(401).json({
			code: 401,
			message: "Log in first.",
		});
};

router.use(json());
router.use(urlencoded({ extended: true }));

router.use("/shorts", userCheck, shortsRouter);
router.use("/articles", articleRouter);
router.use("/dashboard", dashboardRouter);

router.get("/*", (req, res) =>
	res
		.status(404)
		.json({ code: 404, message: `Unknown endpoint: ${req.path}` })
);

export default router;
