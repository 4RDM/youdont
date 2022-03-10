import React, { FC, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { UserContext } from '../utils/UserContext'

const Navbar: FC = (props) => {
	const context = useContext(UserContext)?.data
	const location = useLocation()

	return (
		<div id="navbar">
			<h1>4RDM</h1>
			<div id="nav-buttons">
				<Link to="/">Strona głowna</Link>
				<Link to="/administration">Administracja</Link>
				<Link to="/articles">Artykuły</Link>
				{context?.user == null ?
					<a href="/api/dashboard/login">Logowanie</a> :
					location.pathname == "/panel" ? <a href="/api/dashboard/logout">Wyloguj Się</a> :
						<Link to="/panel">Panel użytkownika</Link>
				}
			</div>
		</div>
	)
}

export default Navbar
