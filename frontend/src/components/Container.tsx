import React, { Component } from 'react'

import Footer from './Footer'
import Navbar from './Navbar'

export default class Container extends Component {
	render() {
		return (
			<div>
				<Navbar></Navbar>
				<div id="content">{this.props.children}</div>
				<Footer></Footer>
			</div>
		)
	}
}
