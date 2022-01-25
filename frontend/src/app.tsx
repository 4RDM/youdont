import React from 'react'
import ReactDOM from 'react-dom'
// import { gsap } from 'gsap'

import './style.scss'
import Container from './components/Container'

const App = () => {
	return (
		<div className="App">
			<Container>
				<div id="home-container">
					<h1>4RDM</h1>
					<p>Serwer tworzony dla ciebie!</p>
				</div>
			</Container>
		</div>
	)
}

ReactDOM.render(<App />, document.getElementById('App'))
