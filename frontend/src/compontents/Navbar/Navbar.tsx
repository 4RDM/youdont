import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useRecoilState } from 'recoil'

import { AccountState } from '../../atoms/AccountState'

import './Navbar.scss'

export default () => {
	const [{ loggedIn }] = useRecoilState(AccountState)
	const [isMobile, setIsMobile] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const location = useLocation()
	const [accountState, _] = useRecoilState(AccountState)

	const handleResize = () => {
		if (window.innerWidth <= 720) setIsMobile(true)
		else setIsMobile(false)
	}

	useEffect(() => {
		handleResize()

		window.addEventListener('resize', handleResize)

		return () => window.removeEventListener('resize', handleResize)
	})

	useEffect(() => {
		setIsOpen(false)
	}, [location])

	const desktopNavbar = (
		<div id="navbar-container">
			<Link to="/">
				<h1>4RDM</h1>
			</Link>
			<div id="navbar-navigator">
				<Link to="/">Strona główna</Link>
				<Link to="/articles">Artykuły</Link>
				<Link to="/administration">Administracja</Link>
				<a href="https://indrop.eu/s/4rdm">Sklep</a>
				{loggedIn ? (
					location.pathname == '/dashboard' ? (
						<a href="/api/dashboard/logout">Wyloguj się</a>
					) : (
						<Link to="/dashboard">{accountState.username}</Link>
					)
				) : (
					<a href="/api/dashboard/login">Zaloguj się</a>
				)}
			</div>
		</div>
	)

	const mobileNavbar = (
		<div id="navbar-container">
			<h1>4RDM</h1>
			<div
				id="navbar-mobile-navigator"
				style={{ display: isOpen ? 'flex' : 'none' }}
			>
				<span
					className="navbar-mobile-toggle a"
					onClick={() => setIsOpen(!isOpen)}
				>
					×
				</span>
				<Link to="/">Strona główna</Link>
				<Link to="/articles">Artykuły</Link>
				<Link to="/administration">Administracja</Link>
				<a href="https://indrop.eu/s/4rdm">Sklep</a>
				{loggedIn ? (
					location.pathname == '/dashboard' ? (
						<a href="/api/dashboard/logout">Wyloguj się</a>
					) : (
						<Link to="/dashboard">{accountState.username}</Link>
					)
				) : (
					<a href="/api/dashboard/login">Zaloguj się</a>
				)}
			</div>
			{!isOpen && (
				<span
					className="navbar-mobile-toggle a"
					onClick={() => setIsOpen(!isOpen)}
				>
					≡
				</span>
			)}
		</div>
	)

	return <nav>{isMobile ? mobileNavbar : desktopNavbar}</nav>
}
