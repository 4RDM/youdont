import React, { Component, CSSProperties } from 'react'

import Footer from './Footer'
import Navbar from './Navbar'

interface Props {
	style?: CSSProperties
	id?: string
}

export default class Container extends Component<Props, any> {
	constructor(props: Props) {
		super(props)
	}
	render() {
		return (
			<div style={this.props.style} id={this.props.id}>
				<Navbar></Navbar>
				<div id="content">{this.props.children}</div>
				<Footer></Footer>
			</div>
		)
	}
}
