import React, { useEffect, Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'

import Loading from './compontents/Loading/Loading'
import Navbar from './compontents/Navbar/Navbar'
import Footer from './compontents/Footer/Footer'

const Home = lazy(() => import('./sites/Home/Home'))
const Articles = lazy(() => import('./sites/Articles/Articles'))
const NotFound = lazy(() => import('./sites/NotFound/NotFound'))
const Article = lazy(() => import('./sites/Articles/Article'))

import './index.scss'

const App = () => {
	const location = useLocation()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [location.pathname])

	return (
		<>
			<div
				id="global-container"
				className={location.pathname == '/' ? 'homepage' : ''}
			>
				<Navbar />
				<div id="content-container">
					<Routes>
						<Route path="/">
							<Route
								index
								element={<Home />}
								loader={() => <Loading />}
							/>
							<Route path="articles">
								<Route
									index
									element={<Articles />}
									loader={() => <Loading />}
								/>
								<Route
									path=":id"
									element={<Article />}
									loader={() => <Loading />}
								/>
							</Route>
							{/* <Route path="about" element={<About />} /> */}
							{/* <Route path="dashboard" element={<Dashboard />} /> */}
							<Route path="*" element={<NotFound />} />
						</Route>
					</Routes>
				</div>
			</div>
			<Footer />
		</>
	)
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<BrowserRouter>
			<RecoilRoot>
				<Suspense fallback={<Loading />}>
					<App />
				</Suspense>
			</RecoilRoot>
		</BrowserRouter>
	</React.StrictMode>
)
