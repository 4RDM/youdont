import React, { FC, useContext } from 'react'
import Container from '../components/Container'
import { UserContext } from '../provider/UserContext'

const Panel: FC = () => {
	const context = useContext(UserContext)

	const podania = [
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
		},
	]

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

	return (
		<Container>
			{(context.user !== null && (
				<div id="panel-container">
					<div id="profile-card">
						<div id="profile-details">
							<img
								crossOrigin="anonymous"
								src={`https://cdn.discordapp.com/avatars/${context.user.user.userid}/${context.user.user.avatar}.png?size=2048`}
								alt="?"
								id="profile-avatar"
							/>
							<div>
								<h1>
									Witaj{' '}
									<b>
										{context.user.user.username}#
										{context.user.user.tag}
									</b>
									!
								</h1>
								<p>{context.user.user.userid}</p>
							</div>
						</div>
						<div>
							<h1>Twoje podania:</h1>
							{podania.map((podanie) => {
								return (
									<div className="podanie-card">
										<h1>{podanie.author}</h1>
										<p>
											{podanie.approved
												? 'Zaakceptowane'
												: 'Odrzucone'}
										</p>
										{!podanie.approved && (
											<p>Powód: {podanie.reason}</p>
										)}
									</div>
								)
							})}
						</div>
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
