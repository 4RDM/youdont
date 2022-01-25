import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Navbar extends Component {
	render() {
		return (
			<div id="navbar">
				<h1>4RDM</h1>

				<div id="nav-buttons">
					<Link to="/">Strona głowna</Link>
					<Link to="articles">Artykuły</Link>
					<a href="">Logowanie</a>
				</div>
			</div>
		)
	}
}
