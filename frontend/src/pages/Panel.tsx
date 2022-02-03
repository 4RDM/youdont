import React, { FC, useContext } from 'react'
import Container from '../components/Container'
import { UserContext } from '../provider/UserContext'

const Panel: FC = () => {
	const context = useContext(UserContext)

	/*
	{
		"user": {
			"code": 200,
			"message": "OK",
			"user": {
				"userid": "364056796932997121",
				"tag": "1010",
				"username": "Nimplex",
				"email": "a@gmail.com",
				"avatar": "71b46749cfd16d05f3630139d9383eb5"
			}
		}
	}
	*/

	const user = Object.values(context.user !== null ? context.user.user : {})

	return (
		<Container>
			{(context.user !== null && (
				<div id="panel-container">
					<div>
						{user.map((val: any) => {
							return <h1>{val}</h1>
						})}
					</div>
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
