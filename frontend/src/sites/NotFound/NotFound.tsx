import React from 'react'

import './NotFound.scss'
import PepeShrug from '../../public/pepeshrug.gif'
import useDocumentTitle from '../../hooks/useDocumentTitle'

export default () => {
	useDocumentTitle('Nie znaleziono strony!')

	return (
		<div id="notfound-container">
			<img src={PepeShrug} alt="Shrugging pepe emoji" />
			<h1>Nie znaleziono strony!</h1>
			<p>Wróć do strony głufnej ❤️</p>
		</div>
	)
}
