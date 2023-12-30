import { Router, json, urlencoded } from "express";

import dashboardRouter from "./routes/dashboard";
import articleRouter from "./routes/article";
import adminlistRouter from "./routes/adminlist";
import embedsRouter from "./routes/embeds";

const router = Router();

router.use(json());
router.use(urlencoded({ extended: true }));

router.use("/articles", articleRouter);
router.use("/dashboard", dashboardRouter);
router.use("/adminlist", adminlistRouter);
router.use("/embeds", embedsRouter);

router.get("/*", (req, res) => res.status(404).json({ code: 404, message: `Unknown endpoint: ${req.path}` }));

export default router;
