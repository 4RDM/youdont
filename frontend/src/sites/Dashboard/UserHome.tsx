import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

import { AccountState } from '../../atoms/AccountState'
import Unauthorized from '../Unauthorized/Unauthorized'

export default () => {
	const [title, setTitle] = useState('Strona użytkownika')
	const [accountState, _] = useRecoilState(AccountState)

	useEffect(() => {
		document.title = title
	}, [title])

	return !accountState.loggedIn ? (
		<Unauthorized />
	) : (
		<>
			<h1>Welcome {accountState.name}</h1>
		</>
	)
}
