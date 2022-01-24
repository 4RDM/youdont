import React from 'react'
import ReactDOM from 'react-dom'
// import { gsap } from 'gsap'

import './style.scss'
import Title from './components/Title'

const App = () => {
	return (
		<div className="App">
			<Title />
		</div>
	)
}

ReactDOM.render(<App />, document.getElementById('App'))
