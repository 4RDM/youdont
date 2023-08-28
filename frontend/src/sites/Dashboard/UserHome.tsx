import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { PulseLoader as PL } from 'react-spinners'

import { AccountState } from '../../atoms/AccountState'
import Unauthorized from '../Unauthorized/Unauthorized'

import './UserHome.scss'
import toast from 'react-hot-toast'

export interface playerStats {
	discord: string
	license: string
	heady: number
	kills: number
	deaths: number
	identifier: string
	playTime: number
	date: Date
	rank: string
}

export default () => {
	const [title, setTitle] = useState('Strona użytkownika')
	const [accountState, _] = useRecoilState(AccountState)
	const [playerStats, setPlayerStats] = useState<null | playerStats>(null)
	const [loading, setLoading] = useState(true)
	const [kdr, setKdr] = useState(0)

	useEffect(() => {
		document.title = title
	}, [title])

	useEffect(() => {
		if (!accountState.loggedIn || !loading || playerStats) return

		setTitle(`${accountState.username} - Strona główna`)

		const fetchData = async () => {
			const request = await fetch('/api/dashboard/stats')
			const jsonBody = await request.json()

			if (jsonBody.code !== 200)
				throw new Error(`Invalid response: ${JSON.stringify(jsonBody)}`)

			console.log(jsonBody)
			const { user } = jsonBody

			setKdr(
				isNaN((user.kills || 0) / (user.deaths || 0))
					? 0
					: (user.kills || 0) / (user.deaths || 0)
			)

			setPlayerStats(user)
			setLoading(false)
		}

		fetchData().catch((err) => {
			console.error(err)
			toast.error("Wystąpił błąd po stronie serwera!", { duration: 5000 });
		})
	}, [accountState.loggedIn])

	if (!accountState.loggedIn) return <Unauthorized />

	return (
		<div id="panel-container">
			<div id="profile-header">
				<img
					crossOrigin="anonymous"
					src={`https://cdn.discordapp.com/avatars/${accountState.userid}/${accountState.avatar}.png?size=2048`}
					alt="User avatar"
					id="profile-avatar"
				/>
				<div>
					{/* prettier-ignore */}
					<h1>Witaj <b>{accountState.username}</b>!</h1>
					<p>{accountState.userid}</p>
				</div>
			</div>
			<div id="profile-details">
				<div className="profile-grid">
					<div className="smallCard">
						<p>Czas gry</p>
						{
							/* prettier-ignore */
							loading ? (<PL color="white" size="12px" />) : (<h1>{((playerStats && playerStats.playTime || 0) / 60).toFixed(2)}h</h1>)
						}
					</div>
					<div className="smallCard">
						<p>Kille</p>
						{
							/* prettier-ignore */
							loading ? (<PL color="white" size="12px" />) : (<h1>{playerStats && playerStats.kills || 0}</h1>)
						}
					</div>
					<div className="smallCard">
						<p>Śmierci</p>
						{
							/* prettier-ignore */
							loading ? (<PL color="white" size="12px" />) : (<h1>{playerStats && playerStats.deaths || 0}</h1>)
						}
					</div>
					<div className="smallCard">
						<p>Heady</p>
						{
							/* prettier-ignore */
							loading ? (<PL color="white" size="12px" />) : (<h1>{playerStats && playerStats.heady || 0}</h1>)
						}
					</div>
					<div className="smallCard">
						<p>K/D</p>
						{
							/* prettier-ignore */
							loading ? (<PL color="white" size="12px" />) : (<h1>{kdr.toFixed(2)}</h1>)
						}
					</div>
					<div className="smallCard">
						<p>Steam HEX</p>
						{
							/* prettier-ignore */
							loading ? (<PL color="white" size="12px" />) : (<h1>{playerStats && playerStats.identifier || 'Nie wykryto'}</h1>)
						}
					</div>
					<div className="smallCard">
						<p>Ranga</p>
						{
							/* prettier-ignore */
							loading ? (<PL color="white" size="12px" />) : (<h1>{playerStats && playerStats.rank}</h1>)
						}
					</div>
				</div>
				{/* <div id="profile-podania">
					<h1>Podania</h1>
					<div className="profile-flex">
						{
							loadingDocs ? (<PL color="white" size="30px" />) : docs.length == 0 ? (<h1>Nie pisałeś jeszcze podań</h1>) : (
					docs.map((podanie) => <PodanieCard key={podanie.id} podanie={podanie} />)
				)
						}
					</div>
				</div> */}
			</div>
		</div>
	)
}
