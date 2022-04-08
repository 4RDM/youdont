import { readFileSync, promises } from "fs";
import { join } from "path";
import { Core } from "../../";

export type Permission =
	| "MANAGE_USERS"
	| "MANAGE_SHORTS"
	| "MANAGE_DOCS"
	| "MANAGE_FILES"
	| "MANAGE_ARTICLES"
	| "ADMINISTRATOR"

export interface User {
	discordID: string
	nickname: string
	avatar: string
	userID: string
	permissions: Permission[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Settings extends Array<any> {
	users: User[]
	docsOpen: boolean
	verificationChannel: string
	verificationRole: string
	donateWebhook: string
}

export class SettingManager {
	private readonly core: Core;
	private readonly path = join(__dirname, "..", "..", "data", "data.json");
	public settings: Settings;

	constructor(core: Core) {
		this.core = core;
		this.settings = JSON.parse(
			readFileSync(this.path, { encoding: "utf-8" })
		);
	}

	async set<T = string>(key: string, value: T | string) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		this.settings[key] = value;
		await promises.writeFile(this.path, JSON.stringify(this.settings), { encoding: "utf-8" });
	}

	get<T = string>(key: string): Promise<T | undefined> {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return this.settings[key];
	}

	getUser(discordID: string): User | undefined {
		return this.settings.users.find(user => user.discordID === discordID);
	}

	hasPermission(discordID: string, permission: Permission): boolean {
		const user = this.settings.users.find(user => user.discordID === discordID);

		if (!user) return false;
		else if (user.permissions.includes("ADMINISTRATOR") || user.permissions.includes(permission)) return true;
		else return false;
	}
}
