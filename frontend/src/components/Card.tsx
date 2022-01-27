import React, { Component } from 'react'

interface Props {
	name: string
	description: string
	author: string
}

export default class Card extends Component<Props, any> {
	constructor(props: Props) {
		super(props)
	}
	render() {
		return (
			<div className="card">
				<div className="card-header">
					<p className="card-title">{this.props.name}</p>
					<p className="card-description">{this.props.description}</p>
				</div>
				<div className="card-footer">
					<p className="author">{this.props.author}</p>
				</div>
			</div>
		)
	}
}
