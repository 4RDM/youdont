import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
// import { gsap } from 'gsap'

import './style.scss'
import { Articles } from './pages/Articles'
import { Home } from './pages/Home'

export const App = () => {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/articles" element={<Articles />} />
			</Routes>
		</div>
	)
}

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById('App')
)
