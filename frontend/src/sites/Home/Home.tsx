import React, { useEffect } from 'react'
import useDocumentTitle from '../../hooks/useDocumentTitle'

import './Home.scss'

export default () => {
	useDocumentTitle('Strona główna')

	return (
		<div id="home-container">
			<h1>
				<span id="home-gradient">4</span>RDM
			</h1>
			<p>Serwer tworzony dla ciebie!</p>
		</div>
	)
}
