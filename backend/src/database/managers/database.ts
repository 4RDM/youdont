import mariadb from "mariadb";
import config from "../../config";
import { Core } from "src/core";

// Managers
import { NotesManager } from "./notatka";
import { DonatesManager } from "./donates";
import { UsersManager } from "./users";

export interface OkPacketInterface {
	affectedRows: number;
	insertId: number;
	warningStatus: number;
}

export class DatabaseCore {
	public readonly botpool;
	public readonly serverpool;

	public readonly notes;
	public readonly donates;
	public readonly users;

	constructor(public readonly core: Core) {
		this.botpool = mariadb.createPool({
			host: config.mariadb.host,
			user: config.mariadb.user,
			password: config.mariadb.password,
			port: config.mariadb.port,
			database: "rdmbot",
		});

		this.serverpool = mariadb.createPool({
			host: config.mysql.host,
			user: config.mysql.user,
			password: config.mysql.password,
			port: config.mysql.port,
			database: "rdm",
		});

		this.notes = new NotesManager(this);
		this.donates = new DonatesManager(this);
		this.users = new UsersManager(this);
	}
}
