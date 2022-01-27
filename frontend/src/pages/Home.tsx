import React, { Component } from 'react'
import Container from '../components/Container'

import tlo from '../public/tloBB.png'

export class Home extends Component {
	render() {
		return (
			<Container
				id="home-container-c"
				style={{
					backgroundImage: `url(${tlo})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			>
				<div id="home-container">
					<h1>4RDM</h1>
					<p>Serwer tworzony dla ciebie!</p>
				</div>
			</Container>
		)
	}
}
