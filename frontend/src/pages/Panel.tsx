import React, { FC, useContext, useEffect, useState } from 'react'
import { PulseLoader as PL } from 'react-spinners'
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

export interface UserStats {
	identifier?: string
	license?: string
	discord?: string
	deaths?: number
	heady?: number
	kills?: number
	kdr?: number
}

const Panel: FC = () => {
	const context = useContext(UserContext)
	const [loadingDocs, setLoadingDocs] = useState(true)
	const [loadingStats, setLoadingStats] = useState(true)
	const [stats, setStats] = useState<UserStats>({})
	const [docs, setDocs] = useState<Doc[]>([])

	useEffect(() => {
		fetch('/api/docs/user/all')
			.then((x) => x.json())
			.then((x) => {
				if (x.code == 401) return
				setDocs(x.data)
				setLoadingDocs(false)
			})
		fetch('/api/dashboard/stats')
			.then((x) => x.json())
			.then((x) => {
				if (x.code == 401) return
				// prettier-ignore
				const kdr = isNaN((x.kills || 0) / (x.deaths || 0)) ? 0 : (x.kills || 0) / (x.deaths || 0)
				setStats({ kdr, ...x })
				setLoadingStats(false)
			})
	}, [])

	return (
		<Container>
			{(context.user !== null && (
				<div id="panel-container">
					<div id="profile-header">
						<img
							crossOrigin="anonymous"
							src={`https://cdn.discordapp.com/avatars/${context.user.user.userid}/${context.user.user.avatar}.png?size=2048`}
							alt="User avatar"
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
								{
									/* prettier-ignore */
									loadingStats ? (<PL color="white" size="12" />) : (<h1>0.0h</h1>)
								}
							</div>
							<div className="smallCard">
								<p>Kille</p>
								{
									/* prettier-ignore */
									loadingStats ? (<PL color="white" size="12" />) : (<h1>{stats.kills || 0}</h1>)
								}
							</div>
							<div className="smallCard">
								<p>Śmierci</p>
								{
									/* prettier-ignore */
									loadingStats ? (<PL color="white" size="12" />) : (<h1>{stats.deaths || 0}</h1>)
								}
							</div>
							<div className="smallCard">
								<p>Heady</p>
								{
									/* prettier-ignore */
									loadingStats ? (<PL color="white" size="12" />) : (<h1>{stats.heady || 0}</h1>)
								}
							</div>
							<div className="smallCard">
								<p>K/D</p>
								{
									/* prettier-ignore */
									loadingStats ? (<PL color="white" size="12" />) : (<h1>{stats.kdr?.toFixed(2)}</h1>)
								}
							</div>
							<div className="smallCard">
								<p>Steam HEX</p>
								{
									/* prettier-ignore */
									loadingStats ? (<PL color="white" size="12" />) : (<h1>{stats.identifier || 'Nie wykryto'}</h1>)
								}
							</div>
							<div className="smallCard">
								<p>Ranga</p>
								{
									/* prettier-ignore */
									loadingStats ? (<PL color="white" size="12" />) : (<h1>Partner+</h1>)
								}
							</div>
						</div>
						<div id="profile-podania">
							<h1>Podania</h1>
							<div className="profile-flex">
								{
									/* prettier-ignore */
									loadingDocs ? (<PL color="white" size="30" />) : docs.length == 0 ? (<h1>Nie pisałeś jeszcze podań</h1>) : (
										docs.map((podanie) => <PodanieCard key={podanie.id} podanie={podanie} />)
									)
								}
							</div>
						</div>
					</div>
				</div>
			)) || (
				<div className="error-401-container">
					<h1>ZALOGUJ SIĘ NAJPIERW!</h1>
				</div>
			)}
		</Container>
	)
}

export default Panel
