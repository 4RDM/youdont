import express from "express";
import session from "express-session";
import expressWs, { Application } from "express-ws";
import { WebSocket } from "ws";

import { Core } from "../core";
import logger from "../utils/logger";

import compression from "compression";
import MemoryStore from "memorystore";

import indexRouter from "./router";
import apiRouter from "./router/api";

const port = 8021;

export default class HTTP {
	public server: Application = expressWs(express()).app;
	public wssclients: WebSocket[] = [];

	constructor(core: Core) {
		// this.server.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));

		const memoryStore = MemoryStore(session);

		this.server.use(
			session({
				secret: "{/GDB4pZjG[CG45_Y8yp~3Km,T$A(Em.]x{9g4'7>@fu&h^g",
				store: new memoryStore({ checkPeriod: 86400000 }),
				resave: false,
				saveUninitialized: false,
			})
		);

		this.server.use(compression());
		this.server.set("view engine", "ejs");

		this.server.use((req, res, next) => {
			req.core = core;
			req.skip = false;
			res.setHeader("x-powered-by", "Nimplex's love"); // easter egg ;)
			next();
		});

		this.server.ws("/api/docs", async ws => {
			this.wssclients.push(ws);
			ws.on("close", () => {
				this.wssclients.splice(this.wssclients.indexOf(ws), 1);
			});
		});

		this.server.use("/api", apiRouter);
		this.server.use("/", indexRouter);

		this.server.listen(port, () =>
			logger.ready(`Website is listening to port ${port}`)
		);
	}
}
