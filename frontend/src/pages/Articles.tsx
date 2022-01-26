import React, { Component } from 'react'
import Container from '../components/Container'
import Card from '../components/Card'

export class Articles extends Component {
	render() {
		return (
			<Container>
				<div id="article-container">
					<Card></Card>
					<Card></Card>
				</div>
			</Container>
		)
	}
}
