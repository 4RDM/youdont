import React, { FC, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../provider/UserContext'

const Navbar: FC = (props) => {
	const context = useContext(UserContext)
	let button

	if (context.user == null)
		button = <a href="/api/dashboard/login">Logowanie</a>
	else button = <a href="/api/dashboard/logout">Wyloguj się</a>

	return (
		<div id="navbar">
			<h1>4RDM</h1>
			<div id="nav-buttons">
				<Link to="/">Strona głowna</Link>
				<Link to="/articles">Artykuły</Link>
				{button}
			</div>
		</div>
	)
}

export default Navbar
