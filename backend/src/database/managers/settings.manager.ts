import { readFileSync } from "fs"
import { join } from "path"
import { Core } from "../../"

export type Permission =
	| "MANAGE_USERS"
	| "MANAGE_SHORTS"
	| "MANAGE_DOCS"
	| "MANAGE_FILES"
	| "ADMINISTRATOR"

export interface User {
	discordID: string
	nickname: string
	avatar: string
	userID: string
	permissions: Permission[]
}

export interface Settings {
	users: User[]
	docsOpen: boolean
	verificationChannel: string
	verificationRole: string
}

export class SettingManager {
	private readonly core: Core
	private readonly path = join(__dirname, "..", "..", "..", "data.json")
	public settings: Settings

	constructor(core: Core) {
		this.core = core
		this.settings = JSON.parse(
			readFileSync(this.path, { encoding: "utf-8" })
		)
	}

	getUser(discordID: string): User | undefined {
		return this.settings.users.find(user => user.discordID === discordID)
	}

	hasPermission(discordID: string, permission: Permission): boolean {
		const user = this.settings.users.find(
			user => user.discordID === discordID
		)

		if (!user) return false
		else if (
			user.permissions.includes("ADMINISTRATOR") ||
			user.permissions.includes(permission)
		)
			return true
		else return false
	}
}
