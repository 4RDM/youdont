import { atom } from 'recoil'
export const AccountState = atom({
	key: 'AccountState',
	default: {
		username: '',
		avatar: '',
		userid: '',
		loggedIn: false,
	},
})
