import HTTPManager from './http/http'

export default class Core {
	public httpManager: HTTPManager

	constructor() {
		this.httpManager = new HTTPManager()
	}
}

export const core = new Core()
