import React, { Component } from 'react'
import Navbar from './Navbar'

export default class Container extends Component {
	render() {
		return (
			<div>
				<Navbar></Navbar>
				<div id="content">{this.props.children}</div>
			</div>
		)
	}
}
