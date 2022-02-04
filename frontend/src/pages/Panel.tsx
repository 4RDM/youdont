import React, { FC, useContext } from 'react'
import Container from '../components/Container'
import PodanieCard from '../components/PodanieCard'
import { UserContext } from '../provider/UserContext'

const Panel: FC = () => {
	const context = useContext(UserContext)

	const podania = [
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
			id: 'IXEt9l',
			admin: 'Helix#0001',
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
			id: 'ylFx6a',
			admin: 'Helix#0001',
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
			id: 'g9MJQU',
			admin: 'Helix#0001',
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
			id: 'UquwOn',
			admin: 'Helix#0001',
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
			id: 'vI2pTO',
			admin: 'Helix#0001',
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
			id: 'kH52lq',
			admin: 'Helix#0001',
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
			id: 'cP22ml',
			admin: 'Helix#0001',
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
			id: 'WNXeBX',
			admin: 'Helix#0001',
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
			id: 'iq1K5l',
			admin: 'Helix#0001',
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
			id: 'XGqinz',
			admin: 'Helix#0001',
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
			id: 'dudhDI',
			admin: 'Helix#0001',
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
			id: 'BhWwuV',
			admin: 'Helix#0001',
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
			id: 'fuGsoO',
			admin: 'Helix#0001',
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
			id: 'VQhNJ4',
			admin: 'Helix#0001',
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
			id: 'DxrX2c',
			admin: 'Helix#0001',
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
			id: 'uLya0c',
			admin: 'Helix#0001',
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
			id: 'q59Njx',
			admin: 'Helix#0001',
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
			id: '7ebeyl',
			admin: 'Helix#0001',
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
			id: 'Ahte7t',
			admin: 'Helix#0001',
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
			id: 'dIAvel',
			admin: 'Helix#0001',
		},
		{
			author: 'Nimplex#1010',
			date: new Date(),
			reason: 'Wiek',
			approved: false,
			id: 'U9Z6qV',
			admin: 'Helix#0001',
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
					<div id="profile-header">
						<img
							crossOrigin="anonymous"
							src={`https://cdn.discordapp.com/avatars/${context.user.user.userid}/${context.user.user.avatar}.png?size=2048`}
							alt="?"
							id="profile-avatar"
						/>
						<div>
							{/* prettier-ignore */}
							<h1>Witaj <b>{context.user.user.username}#{context.user.user.tag}</b>!</h1>
							<p>{context.user.user.userid}</p>
						</div>
					</div>
					<div id="profile-details">
						<h1>Statystyki</h1>
						<div className="profile-grid">
							<div className="smallCard">
								<p>Czas gry</p>
								<h1>0h</h1>
							</div>
							<div className="smallCard">
								<p>Kille</p>
								<h1>0</h1>
							</div>
							<div className="smallCard">
								<p>Śmierci</p>
								<h1>0</h1>
							</div>
							<div className="smallCard">
								<p>Heady</p>
								<h1>0</h1>
							</div>
							<div className="smallCard">
								<p>K/D</p>
								<h1>0.0</h1>
							</div>
							<div className="smallCard">
								<p>Steam HEX</p>
								<h1>Nie wykryto</h1>
							</div>
							<div className="smallCard">
								<p>Ranga</p>
								<h1>Partner+</h1>
							</div>
						</div>
						<div id="profile-podania">
							<h1>Podania</h1>
							<div className="profile-flex">
								{podania.length == 0 ? (
									<h1>Nie pisałeś jeszcze podań</h1>
								) : (
									podania.map((podanie) => {
										return (
											<PodanieCard
												key={podanie.id}
												podanie={podanie}
											/>
										)
									})
								)}
							</div>
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
