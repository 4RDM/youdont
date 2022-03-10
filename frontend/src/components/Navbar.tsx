import React, { FC, useContext, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { UserContext } from '../utils/UserContext'

const Navbar: FC = (props) => {
	const context = useContext(UserContext)?.data
	const location = useLocation()
	const [isMobile, setMobile] = useState(false)
	const [isOpen, setOpen] = useState(false)

	const checkIsMobile = () => setMobile((window.matchMedia && window.matchMedia("(max-width: 680px)").matches))

	useEffect(() => {
		checkIsMobile()
		window.addEventListener("resize", checkIsMobile)
		return window.removeEventListener("resize", checkIsMobile)
	}, [])

	return (
		<>
			<div id="nav-sidebar" style={{display: isOpen ? "flex" : "none"}}>
				<h1> W </h1>		
			</div>
			<div id="navbar">
				<h1>4RDM</h1>
				{!isMobile ? <div id="nav-buttons">
							<Link to="/">Strona głowna</Link>
							<Link to="/administration">Administracja</Link>
							<Link to="/articles">Artykuły</Link>
							{context?.user == null ?
								<a href="/api/dashboard/login">Logowanie</a> :
								location.pathname == "/panel" ? <a href="/api/dashboard/logout">Wyloguj Się</a> :
									<Link to="/panel">Panel użytkownika</Link>
							}
						</div>
				:	<div id="nav-open-close">
						<button onClick={() => setOpen(true)}>≡</button>
					</div>
				}
			</div>
		</>
	)
}

export default Navbar
