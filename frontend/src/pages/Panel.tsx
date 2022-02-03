import React, { FC, useContext } from 'react'
import Container from '../components/Container'
import { UserContext } from '../provider/UserContext'

const Panel: FC = () => {
	const context = useContext(UserContext)

	return (
		<Container>
			{(context.user !== null && (
				<div id="panel-container">
					<h1>{context.user.user.username}</h1>
				</div>
			)) || (
				<div className="error-401-container">
					<h1>
						Nie masz tutaj dostępu do tego miejsca, zaloguj się
						najpierw!
					</h1>
				</div>
			)}
		</Container>
	)
}

export default Panel
