import axios from 'axios'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { State } from './Container'

export default class Navbar extends Component<any, State> {
	constructor(props: any) {
		super(props)

		this.state = { session: undefined }
	}

	componentDidMount() {
		axios
			.get('/api/dashboard/session')
			.then((res) => {
				const { data } = res
				this.setState({ session: data.user })
			})
			.catch((err) => {
				this.setState({ session: undefined })
			})
	}

	render() {
		let button =
			this.state.session === undefined ? (
				<a href="/api/dashboard/login">Logowanie</a>
			) : (
				<a href="/api/dashboard/logout">Wyloguj się</a>
			)

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
}
