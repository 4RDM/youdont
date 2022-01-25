import React, { Component } from 'react'

export default class Navbar extends Component {
	render() {
		return (
			<div id="navbar">
				<h1>4RDM</h1>
				<div id="nav-buttons">
					<button>Artykuły</button>
					<button>Zaloguj Się</button>
				</div>
			</div>
		)
	}
}
