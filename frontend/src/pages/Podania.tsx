import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import Container from '../components/Container'
import Popup from '../components/Popup'
import { UserContext } from '../utils/UserContext'
import { PulseLoader as PL } from 'react-spinners'

const Podania: FC = () => {
	const context = useContext(UserContext)?.data
	const [steam, setSteam] = useState("")
	const [loading, setLoading] = useState(true)
	const [showPopup, setShowPopup] = useState(false)
	const [popupTitle, setPopupTitle] = useState('')
	const [popupContent, setPopupContent] = useState('')

	const discordID = useRef<HTMLInputElement>(null);
	const discordTag = useRef<HTMLInputElement>(null);
	const steamURL = useRef<HTMLInputElement>(null);
	const age = useRef<HTMLInputElement>(null);
	const short = useRef<HTMLTextAreaElement>(null);
	const long = useRef<HTMLTextAreaElement>(null);

	const err = () => {
		setPopupContent('Nieznany błąd serwera!')
		setPopupTitle('❌ Błąd!')
		setShowPopup(true)
	}

	useEffect(() => {
		fetch('/api/dashboard/stats')
			.then((x) => x.json())
			.then((x) => {
				if (x.code !== 200) return err()
				if (x.identifier) setSteam(`https://steamcommunity.com/profiles/${BigInt(x.identifier.replace("steam:", "0x")).toString(10)}`)
				setLoading(false)
			})
	}, [])

	const upload = () => {
		fetch('/api/docs/upload', {
			body: JSON.stringify({
				author: discordID.current?.value,
				nick: discordTag.current?.value,
				steam: steamURL.current?.value,
				age: age.current?.value,
				short: short.current?.value,
				long: long.current?.value,
			}),
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(x => x.json()).then(x => {
			if (x.code !== 200) return err()
			else alert("OK")
		})
	}

	return (
		<Container>
			{(context?.user !== undefined && (
				loading ? (<div id="TOP_LOADING"><PL color="white" size="30px" /></div>) : (
					<div id="podanie-container">
						{showPopup && (
							<Popup
								title={popupTitle}
								content={popupContent}
								handleClose={() => setShowPopup(!showPopup)}
							/>
						)}
						<h1>Formularz, podania na Trial Supporta</h1>
						<div>
							<label htmlFor="author">Discord ID</label>
							<input type="text" ref={discordID} name="author" placeholder="0000000000000000" value={context.user.userid} disabled required />

							<label htmlFor="nick">Discord Tag</label>
							<input type="text" ref={discordTag} name="nick" placeholder="Wumpus#0000" value={`${context.user.username}#${context.user.tag}`} disabled required />

							<label htmlFor="steam">Link do steama</label>
							<input type="url" ref={steamURL} name="steam" placeholder="https://steamcommunity.com/id/gabelogannewell" value={steam} required />

							<label htmlFor="age">Wiek</label>
							<input type="number" ref={age} placeholder="Wiek" min="12" max="99" name="age" required />

							<label htmlFor="short">Krótki Opis</label>
							<textarea name="short" ref={short} minLength={30} required />

							<label htmlFor="long">Dłuższy opis siebie</label>
							<textarea name="long" ref={long} minLength={200} required />

							<button onClick={() => upload()}>Wyślij</button>
						</div>
					</div>
				)
			)) || (
				<div className="error-401-container">
					<h1>Zaloguj się najpierw!</h1>
				</div>
			)}
		</Container>
	)
}

export default Podania
