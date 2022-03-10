import React, { FC, useContext, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { UserContext } from '../utils/UserContext'

const Navbar: FC = (props) => {
	const context = useContext(UserContext)?.data
	const location = useLocation()
	const [isMobile, setMobile] = useState(false)
	const [isOpen, setOpen] = useState(false)

	const PanelOrLogout = context?.user == null ? <a href="/api/dashboard/login">Logowanie</a> : location.pathname == "/panel" ? <a href="/api/dashboard/logout">Wyloguj Się</a> : <Link to="/panel">Panel użytkownika</Link>

	const checkIsMobile = () => setMobile((window.matchMedia && window.matchMedia("(max-width: 680px)").matches))

	useEffect(() => {
		checkIsMobile()
		window.addEventListener("resize", checkIsMobile)
	}, [])

	useEffect(() => {
		if (!isMobile) setOpen(isMobile)
	}, [isMobile])

	return (
		<>
			{/* MOBILE NAVBAR */}
			<div id="nav-sidebar" style={{display: isOpen ? "flex" : "none"}}>
				<button className="nav-sidebar-button" onClick={() => setOpen(false)}>×</button>
				<div>
					<Link to="/">Strona główna</Link>
					<Link to="/administration">Administracja</Link>
					<Link to="/articles">Artykuły</Link>
					{PanelOrLogout}
				</div>
			</div>
			{/* DESKTOP NAVBAR */}
			<div id="navbar">
				<h1>4RDM</h1>
				<div id="nav-buttons">
					{!isMobile ? (<>
						<Link to="/">Strona główna</Link>
						<Link to="/administration">Administracja</Link>
						<Link to="/articles">Artykuły</Link>
						{PanelOrLogout}
					</>): <button className="nav-sidebar-button" onClick={() => setOpen(true)}>≡</button>
					}
				</div>
			</div>
		</>
	)
}

export default Navbar
