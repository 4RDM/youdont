import expressWs, { Application } from 'express-ws'
import express from 'express'

import indexRouter from './router/index.router'
import apiRouter from './router/api.router'

export default class HTTPManager {
	public server: Application = expressWs(express()).app

	constructor() {
		this.server.use('/', indexRouter)
		this.server.use('/api', apiRouter)

		this.server.listen(80, () => console.log('Listening to port 80'))
	}
}
