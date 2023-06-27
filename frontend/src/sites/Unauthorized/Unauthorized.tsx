import React from 'react'

import '../NotFound/NotFound.scss'
import PepeCry from '../../public/pepecry.png'
import useDocumentTitle from '../../hooks/useDocumentTitle'

export default () => {
	useDocumentTitle('Odmowa dostępu!')

	return (
		<div id="notfound-container">
			<img src={PepeCry} alt="Crying pepe emoji" />
			<h1>Odmowa dostępu!</h1>
			<p>zaloguj się do swojego konta! 💀</p>
		</div>
	)
}
