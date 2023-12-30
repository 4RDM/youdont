import React, { useEffect, Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { RecoilRoot, useRecoilState } from 'recoil'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';

import Loading from './compontents/Loading/Loading'
import Navbar from './compontents/Navbar/Navbar'
import Footer from './compontents/Footer/Footer'

import { AccountState } from './atoms/AccountState'

import Home from './sites/Home/Home'
const AdminList = lazy(() => import('./sites/AdministrationList/Administration'))
const Articles = lazy(() => import('./sites/Articles/Articles'))
const NotFound = lazy(() => import('./sites/NotFound/NotFound'))
const Article = lazy(() => import('./sites/Articles/Article'))

import './index.scss'
import UserHome from './sites/Dashboard/UserHome'
import Embeds from './sites/Embeds/Embeds';

const App = () => {
	const location = useLocation()
	const [accountState, setAccountState] = useRecoilState(AccountState)

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [location.pathname])

	useEffect(() => {
		fetch('/api/dashboard/session')
			.then((res) => res.json())
			.then((data) => {
				if (accountState.loggedIn) return

				const { user } = data

				if (!user || !user.userid || !user.username || !user.avatar)
					return console.log('Not logged in, skipping state')

				setAccountState({
					userid: user.userid,
					username: user.username,
					avatar: user.avatar,
					loggedIn: true,
				})
			})
			.catch((err) => {
				console.log(err)
			})
	}, [])

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
							<Route path="dashboard">
								<Route index element={<UserHome />} />
							</Route>
							<Route path="administration" element={<AdminList />} />
							{/* <Route path="about" element={<About />} /> */}
							{/* <Route path="dashboard" element={<Dashboard />} /> */}
							<Route path="embeds/:id" element={<Embeds />} />
							<Route path="*" element={<NotFound />} />
						</Route>
					</Routes>
				</div>
			</div>
			<Toaster
				position="bottom-right"
				toastOptions={{
					error: {
						style: {
							background: '#333',
							color: '#fff',
						},
					}
				}}
			/>
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
