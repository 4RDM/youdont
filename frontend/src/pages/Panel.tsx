import React, { FC, useContext, useEffect, useState } from 'react'
import { PulseLoader as PL } from 'react-spinners'
import Container from '../components/Container'
import PodanieCard from '../components/PodanieCard'
import { UserContext } from '../utils/UserContext'
import Popup from '../components/Popup'
import { Link } from 'react-router-dom'

export interface Doc {
	author: string
	date: number
	reason: string
	approved: boolean
	active: boolean
	_id: string
	approver: string
}

export interface UserStats {
	identifier?: string
	license?: string
	discord?: string
	deaths?: number
	heady?: number
	kills?: number
	kdr?: number
	playTime?: number
}

const Panel: FC = () => {
	const context = useContext(UserContext)?.data
	const [loadingDocs, setLoadingDocs] = useState(true)
	const [loadingStats, setLoadingStats] = useState(true)
	const [stats, setStats] = useState<UserStats>({})
	const [docs, setDocs] = useState<Doc[]>([])
	const [showPopup, setShowPopup] = useState(false)
	const [popupTitle, setPopupTitle] = useState('')
	const [popupContent, setPopupContent] = useState('')

	const err = () => {
		setPopupContent('Nieznany błąd serwera!')
		setPopupTitle('❌ Błąd!')
		setShowPopup(true)
	}

	useEffect(() => {
		if (context?.user == undefined) return
		fetch('/api/docs/user/all')
			.then((x) => x.json())
			.then((x) => {
				if (x.code !== 200) return err()
				setDocs(x.data)
				setLoadingDocs(false)
			})
			.catch(err)
		fetch('/api/dashboard/stats')
			.then((x) => x.json())
			.then((x) => {
				if (x.code !== 200) return err()
				// prettier-ignore
				const kdr = isNaN((x.kills || 0) / (x.deaths || 0)) ? 0 : (x.kills || 0) / (x.deaths || 0)
				setStats({ kdr, ...x })
				setLoadingStats(false)
			})
			.catch(err)
	}, [context])

	return (
		<Container>
			{(context?.user !== undefined && (
				<div id="panel-container">
					{showPopup && (
						<Popup
							title={popupTitle}
							content={popupContent}
							handleClose={() => setShowPopup(!showPopup)}
						/>
					)}
					<div id="profile-header">
						<img
							crossOrigin="anonymous"
							src={`https://cdn.discordapp.com/avatars/${context?.user.userid}/${context?.user.avatar}.png?size=2048`}
							alt="User avatar"
							id="profile-avatar"
						/>
						<div>
							<h1>Witaj <b>{context?.user.username}#{context?.user.tag}</b>!</h1>
							<p>{context?.user?.userid}</p>
						</div>
					</div>
					<div id="profile-details">
						<h1>Statystyki</h1>
						<div className="profile-grid">
							<div className="smallCard">
								<p>Czas gry</p>
								{ loadingStats ? (<PL color="white" size="12px" />) : (<h1>{((stats.playTime || 0) / 60).toFixed(2)}h</h1>) }
							</div>
							<div className="smallCard">
								<p>Kille</p>
								{ loadingStats ? (<PL color="white" size="12px" />) : (<h1>{stats.kills || 0}</h1>) }
							</div>
							<div className="smallCard">
								<p>Śmierci</p>
								{ loadingStats ? (<PL color="white" size="12px" />) : (<h1>{stats.deaths || 0}</h1>) }
							</div>
							<div className="smallCard">
								<p>Heady</p>
								{ loadingStats ? (<PL color="white" size="12px" />) : (<h1>{stats.heady || 0}</h1>) }
							</div>
							<div className="smallCard">
								<p>K/D</p>
								{ loadingStats ? (<PL color="white" size="12px" />) : (<h1>{stats.kdr?.toFixed(2)}</h1>) }
							</div>
							<div className="smallCard">
								<p>Steam HEX</p>
								{ loadingStats ? (<PL color="white" size="12px" />) : (<h1>{stats.identifier || 'Nie wykryto'}</h1>) }
							</div>
							<div className="smallCard">
								<p>Ranga</p>
								{ loadingStats ? (<PL color="white" size="12px" />) : (<h1>{context.user.role}</h1>) }
							</div>
						</div>
						<div id="profile-podania">
							<h1>Podania</h1>
							{(context.permissions.includes('ADMINISTRATOR') || context.permissions.includes('MANAGE_DOCS')) && <Link to="/panel/admin">Sprawdzanie podań</Link>}
							<div className="profile-flex">
								{
									loadingDocs ? (<PL color="white" size="30px" />) : docs.length == 0 ? (<p>Nie pisałeś jeszcze podań</p>) : (
										docs.map((podanie) => <PodanieCard key={podanie._id} podanie={podanie} />)
									)
								}
							</div>
						</div>
					</div>
				</div>
			)) || (
				<div className="error-401-container">
					<h1>Zaloguj się najpierw!</h1>
				</div>
			)}
		</Container>
	)
}

export default Panel
