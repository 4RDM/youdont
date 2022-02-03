import { createContext } from 'react'

// interface UserContext {
// 	UserID?: string
// 	UserTag?: string
// 	Username?: string
// 	UserEmail?: string
// 	UserAvatar?: string
// }

export type IUserContext = any
export const UserContext = createContext<IUserContext>(null)
