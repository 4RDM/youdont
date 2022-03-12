import React, { FC } from 'react'
import Container from '../components/Container'

// @ts-ignore
import tlo from '../public/tloBB.webp'

const Home: FC = () => {
	return (
		<Container id="home-container-c" style={{ backgroundImage: `url(${tlo})` }}>
			<div id="home-container">
				<h1>4RDM</h1>
				<p>Serwer tworzony dla ciebie!</p>
			</div>
		</Container>
	)
}

export default Home
