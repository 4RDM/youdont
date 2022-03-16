import React, { lazy, Suspense, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { IUserContext, UserContext } from './utils/UserContext'
import ScrollToTop from './utils/ScrollToTop'

// import { gsap } from 'gsap'

import './style.scss'

const FileUploader = lazy(() => import('./pages/FIleUploader'))
const Owners = lazy(() => import('./pages/Owners'))
const Podania = lazy(() => import('./pages/Podania'))
const AdminDocs = lazy(() => import('./pages/PanelDocs'))
const Articles = lazy(() => import('./pages/Articles'))
const Home = lazy(() => import('./pages/Home'))
const Panel = lazy(() => import('./pages/Panel'))
const Administration = lazy(() => import('./pages/Administration'))

export const App = () => {
	const [user, setUser] = useState<IUserContext>(null)

	useEffect(() => {
		fetch('/api/dashboard/session')
			.then((x) => x.json())
			.then((j) => {
				if (j.code == 401) setUser(null)
				else
					setUser({
						data: {
							user: j.user,
							permissions: j.permissions,
						},
					})
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
					{/* @ts-ignore */}
					<UserContext.Provider value={{ data: user?.data }}>
						<ScrollToTop />
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/articles" element={<Articles />} />
							<Route path="/panel" element={<Panel />} />
							<Route path="/panel/admin" element={<AdminDocs />} />
							<Route path="/files" element={<FileUploader />} />
							<Route path="/administration" element={<Administration />} />
							<Route path="/podania" element={<Podania />} />
							<Route path="/wlasciciele" element={<Owners />} />
						</Routes>
					</UserContext.Provider>
				</Suspense>
			</div>
		</BrowserRouter>
	)
}

ReactDOM.render(<App />, document.getElementById('App'))
