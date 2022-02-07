import React, { lazy, Suspense, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { IUserContext, UserContext } from './utils/UserContext'
import ScrollToTop from './utils/ScrollToTop'

// import { gsap } from 'gsap'

import './style.scss'

const Articles = lazy(() => import('./pages/Articles'))
const Home = lazy(() => import('./pages/Home'))
const Panel = lazy(() => import('./pages/Panel'))

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
				<Suspense
					fallback={
						<div id="TOP_LOADING">
							<p>Wczytywanie...</p>
						</div>
					}
				>
					<UserContext.Provider value={{ user, setUser }}>
						<ScrollToTop />
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="articles" element={<Articles />} />
							<Route path="panel" element={<Panel />} />
						</Routes>
					</UserContext.Provider>
				</Suspense>
			</div>
		</BrowserRouter>
	)
}

ReactDOM.render(<App />, document.getElementById('App'))
