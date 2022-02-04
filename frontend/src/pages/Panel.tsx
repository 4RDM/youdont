import React, { FC, useContext, useEffect, useState } from 'react'
import Container from '../components/Container'
import PodanieCard from '../components/PodanieCard'
import { UserContext } from '../utils/UserContext'

export interface Doc {
	author: string
	date: number
	reason: string
	approved: boolean
	id: string
	admin: string
}

const Panel: FC = () => {
	const context = useContext(UserContext)
	const [loading, setLoading] = useState(true)
	const [docs, setDocs] = useState<Doc[]>([])

	useEffect(() => {
		fetch('/api/docs/user/all')
			.then((x) => x.json())
			.then((x) => {
				if (x.code == 401) return
				setDocs(x.data)
				setLoading(false)
			})
	}, [])

	scrollTo({ top: 100 })

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
								{loading ? (
									<h1>Wczytywanie...</h1>
								) : docs.length == 0 ? (
									<h1>Nie pisałeś jeszcze podań</h1>
								) : (
									docs.map((podanie) => {
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
