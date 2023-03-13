import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { AccountState } from '../../atoms/AccountState'

import './Navbar.scss'

export default () => {
	const [{ loggedIn }] = useRecoilState(AccountState)
	const [isMobile, setIsMobile] = useState(false)
	const [isOpen, setIsOpen] = useState(false)

	const handleResize = () => {
		if (window.innerWidth <= 720) setIsMobile(true)
		else setIsMobile(false)
	}

	useEffect(() => {
		handleResize()

		window.addEventListener('resize', handleResize)

		return () => window.removeEventListener('resize', handleResize)
	})

	const desktopNavbar = (
		<div id="navbar-container">
			<Link to="/">
				<h1>4RDM</h1>
			</Link>
			<div id="navbar-navigator">
				<Link to="/">Strona główna</Link>
				<Link to="/articles">Artykuły</Link>
				{loggedIn ? (
					<a>Nimplex#1010</a>
				) : (
					<a href="/login">Zaloguj się</a>
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
				<a
					className="navbar-mobile-toggle"
					onClick={() => setIsOpen(!isOpen)}
				>
					×
				</a>
				<Link to="/">Strona główna</Link>
				<Link to="/articles">Artykuły</Link>
				{loggedIn ? (
					<a>Nimplex#1010</a>
				) : (
					<a href="/login">Zaloguj się</a>
				)}
			</div>
			{!isOpen && (
				<a
					className="navbar-mobile-toggle"
					onClick={() => setIsOpen(!isOpen)}
				>
					≡
				</a>
			)}
		</div>
	)

	return isMobile ? mobileNavbar : desktopNavbar
}
