import HTTP from './http/http'

export default class Core {
	public httpServer: HTTP

	constructor() {
		this.httpServer = new HTTP()
	}
}

export const core = new Core()
