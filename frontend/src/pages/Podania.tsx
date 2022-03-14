import React, { FC } from 'react'
import Container from '../components/Container'

const Podania: FC = () => {
	return <Container>
		<form action="/api/docs/upload" method="post">
			<input type="text" name="author" />
			<input type="text" name="nick" />
			<input type="text" name="age" />
			<input type="text" name="voice" />
			<input type="text" name="long" />
			<input type="text" name="short" />
			<input type="text" name="steam" />
			<input type="submit" value="Wyslij" />
		</form>
	</Container>
}

export default Podania
