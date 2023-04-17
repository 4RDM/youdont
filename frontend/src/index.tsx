import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './compontents/Navbar/Navbar'
import Footer from './compontents/Footer/Footer'
import Home from './sites/Home/Home'
import Articles from './sites/Articles/Articles'
import NotFound from './sites/NotFound/NotFound'
import './index.scss'
import Article from './sites/Articles/Article'

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
							<Route index element={<Home />} />
							<Route path="articles">
								<Route index element={<Articles />} />
								<Route path=":id" element={<Article />} />
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
				<App />
			</RecoilRoot>
		</BrowserRouter>
	</React.StrictMode>
)
