import Database from "./database/database"
import HTTP from "./http/http"

export default class Core {
	public httpServer: HTTP
	public database: Database

	constructor() {
		this.httpServer = new HTTP()
		this.database = new Database()
	}
}

export const core = new Core()
