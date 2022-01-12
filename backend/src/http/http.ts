import expressWs, { Application } from 'express-ws'
import express from 'express'
import helmet from 'helmet'
import session from 'express-session'

import indexRouter from './router/index.router'
import apiRouter from './router/api.router'

export default class HTTPManager {
	public server: Application = expressWs(express()).app

	constructor() {
		this.server.use(helmet({ contentSecurityPolicy: false }))
		this.server.use(
			session({
				secret: '213213132123',
				resave: false,
				saveUninitialized: true,
				cookie: {
					secure: false, // tylko na razie
				},
			})
		)

		this.server.use('/', indexRouter)
		this.server.use('/api', apiRouter)

		this.server.listen(80, () => console.log('Listening to port 80'))
	}
}
