import React, { Component } from 'react'
import Container from '../components/Container'
import Card from '../components/Card'

export class Articles extends Component {
	render() {
		return (
			<Container>
				<div id="article-container">
					<Card
						name="Wpłata na serwer"
						description="Artykuł przedstawiający jak dokonać wpłaty na serwer."
						author="Nimplex"
					/>
					<Card
						name="Skąd zdobyć hexa?"
						description="Poradnik jak sprawdzić identyfikator HEX konta steam."
						author="Nimplex"
					/>
				</div>
			</Container>
		)
	}
}
