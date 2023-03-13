import React from 'react'

import './NotFound.scss'
import PepeShrug from '../../public/pepeshrug.gif'

export default () => {
	return (
		<div id="notfound-container">
			<img src={PepeShrug} alt="Shrugging pepe emoji" />
			<h1>Nie znaleziono strony!</h1>
			<p>Wróć do strony głufnej ❤️</p>
		</div>
	)
}
