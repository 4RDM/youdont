import React, { Component } from 'react'

import Footer from './Footer'
import Navbar from './Navbar'
import tlo from '../public/tloBB.png'

export default class Container extends Component {
	render() {
		return (
			<div
				style={{
					backgroundImage: `url(${tlo})`,
				}}
			>
				<Navbar></Navbar>
				<div id="content">{this.props.children}</div>
				<Footer></Footer>
			</div>
		)
	}
}
