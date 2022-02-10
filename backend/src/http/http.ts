import expressWs, { Application } from "express-ws"
import express from "express"
import helmet from "helmet"
import session from "express-session"
import logger from "../utils/logger"
import compression from "compression"
import { Core } from "../"

import indexRouter from "./router/index.router"
import apiRouter from "./router/api.router"

export default class HTTP {
	public server: Application = expressWs(express()).app

	constructor(core: Core) {
		this.server.use(helmet({ contentSecurityPolicy: false }))
		this.server.use(
			session({
				secret: "{/GDB4pZjG[CG45_Y8yp~3Km,T$A(Em.]x{9g4'7>@fu&h^g",
				resave: false,
				saveUninitialized: true,
				cookie: {
					secure: false, // tylko na razie
				},
			})
		)
		this.server.use(compression())

		this.server.use((req, res, next) => {
			req.core = core
			res.setHeader("x-powered-by", "Nimplex's love") // easter egg ;)
			next()
		})
		this.server.use("/api", apiRouter)
		this.server.use("/", indexRouter)

		this.server.listen(80, () => logger.ready("Listening to port 80"))
	}
}
