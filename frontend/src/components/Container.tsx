import React, { Component, CSSProperties } from 'react'

import Footer from './Footer'
import Navbar from './Navbar'

interface Props {
	style?: CSSProperties
}

export default class Container extends Component<Props, any> {
	constructor(props: Props) {
		super(props)
	}
	render() {
		return (
			<div style={this.props.style}>
				<Navbar></Navbar>
				<div id="content">{this.props.children}</div>
				<Footer></Footer>
			</div>
		)
	}
}
