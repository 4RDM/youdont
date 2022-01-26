import React, { Component } from 'react'

interface Props {
	name: string
	description: string
}

export default class Card extends Component<Props, any> {
	constructor(props: Props) {
		super(props)
	}
	render() {
		return (
			<div className="card">
				<p className="card-title">{this.props.name}</p>
				<p className="card-description">{this.props.description}</p>
			</div>
		)
	}
}
