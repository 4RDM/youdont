import React, { Component, CSSProperties } from 'react'

import Footer from './Footer'
import Navbar from './Navbar'

interface Props {
	style?: CSSProperties
	id?: string
}

interface session {
	UserID: string
	UserTag: string
	Username: string
	UserEmail: string
	UserAvatar: string
}
export type Session = session | undefined

export interface State {
	session: Session
}

export default class Container extends Component<Props> {
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
