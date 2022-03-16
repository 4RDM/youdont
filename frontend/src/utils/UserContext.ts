import { createContext } from 'react'

export type Permission =
	| 'MANAGE_USERS'
	| 'MANAGE_SHORTS'
	| 'MANAGE_DOCS'
	| 'MANAGE_FILES'
	| 'ADMINISTRATOR'

interface UserContext {
	data: {
		user: {
			userid: string
			tag: string
			username: string
			email: string
			avatar: string
			role: string
			applicationState: boolean
		}
		permissions: Permission[]
	}
}

export type IUserContext = UserContext | null
export const UserContext = createContext<IUserContext>(null)
