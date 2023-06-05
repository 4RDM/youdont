import mariadb from "mariadb";
import config from "../../config";
import { Core } from "src/core";

// Managers
import { NotesManager } from "./notatka";
import { DonatesManager } from "./donates";
import { UsersManager } from "./users";

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

		// this.init();
	}

	// async init() {
	// 	const users = await this.core.database.users.getAll();

	// 	for (const user of users) {
	// 		await this.users.create(user.userID, user.total);

	// 		for (const notatka of user.notatki) {
	// 			await this.notes.create(
	// 				user.userID,
	// 				notatka.authorID || "0",
	// 				notatka.content
	// 			);
	// 		}

	// 		this.core.bot.logger.log("Database", `Created user ${user.userID}`);
	// 	}

	// 	const donates = await this.core.database.donates.getAll();

	// 	for (const donate of donates) {
	// 		const donate2 = await this.donates.create(
	// 			donate.userID,
	// 			donate.type
	// 		);

	// 		if (!donate2) {
	// 			this.core.bot.logger.error(
	// 				"Database",
	// 				`Donate ${donate.dID} is null`
	// 			);
	// 			continue;
	// 		}

	// 		if (donate.approved)
	// 			await this.donates.approve(
	// 				donate2.id,
	// 				donate.amount || 0,
	// 				donate.approver || ""
	// 			);

	// 		this.core.bot.logger.log(
	// 			"Database",
	// 			`Created donate ${donate.dID}`
	// 		);
	// 	}
	// }
}
