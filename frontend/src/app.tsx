import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { IUserContext, UserContext } from './provider/UserContext'

// import { gsap } from 'gsap'

import './style.scss'
import Articles from './pages/Articles'
import Home from './pages/Home'
import Panel from './pages/Panel'

export const App = () => {
	const [user, setUser] = useState<IUserContext>(null)

	useEffect(() => {
		fetch('/api/dashboard/session')
			.then((x) => x.json())
			.then((j) => {
				if (j.code == 401) setUser(null)
				else setUser(j)
			})
	}, [])

	return (
		<BrowserRouter>
			<div className="App">
				<UserContext.Provider value={{ user, setUser }}>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="articles" element={<Articles />} />
						<Route path="panel" element={<Panel />} />
					</Routes>
				</UserContext.Provider>
			</div>
		</BrowserRouter>
	)
}

ReactDOM.render(<App />, document.getElementById('App'))
