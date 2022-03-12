import express from "express";
import session from "express-session";
import expressWs, { Application } from "express-ws";

import { Core } from "../";
import logger from "../utils/logger";

import helmet from "helmet";
import compression from "compression";
import MemoryStore from "memorystore";

import indexRouter from "./router/index.router";
import apiRouter from "./router/api.router";

export default class HTTP {
	public server: Application = expressWs(express()).app;

	constructor(core: Core) {
		this.server.use(helmet({ contentSecurityPolicy: false }));

		const memoryStore = MemoryStore(session);

		this.server.use(
			session({
				secret: "{/GDB4pZjG[CG45_Y8yp~3Km,T$A(Em.]x{9g4'7>@fu&h^g",
				store: new memoryStore({ checkPeriod: 86400000 }),
				resave: false,
				saveUninitialized: false,
				cookie: {
					secure: process.env.NODE_ENV == "production",
				},
			})
		);
	
		this.server.use(compression());
		this.server.set("view engine", "ejs");

		this.server.use((req, res, next) => {
			req.core = core;
			res.setHeader("x-powered-by", "Nimplex's love"); // easter egg ;)
			next();
		});
		this.server.use("/api", apiRouter);
		this.server.use("/", indexRouter);

		this.server.listen(80, () => logger.ready("Listening to port 80"));
	}
}
