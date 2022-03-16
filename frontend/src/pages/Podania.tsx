import React, { FC, useContext, useEffect, useMemo, useRef, useState } from 'react'
import Container from '../components/Container'
import Popup from '../components/Popup'
import { UserContext } from '../utils/UserContext'
import { PulseLoader as PL } from 'react-spinners'

interface props {
	reference: React.MutableRefObject<any>
	disabled?: boolean
	error: string
	label: string
	name: string
	placeholder?: string
	value?: string
	type?: "number" | "long"
}

const Input: FC<props> = (Props: props) => {
	const [value, setValue] = useState(Props.value)

	useMemo(() => {
		if (!Props.value) setValue("")
	}, [Props])

	return (
		<>
			<label htmlFor={Props.name}>{Props.label}</label>
			
			{Props.type == "long" ? (
				<textarea name="long" ref={Props.reference} placeholder={Props.placeholder || ""} required />
			): (
				<input type={Props.type || "text"} ref={Props.reference} name={Props.name} placeholder={Props.placeholder || ""} onChange={(ev) => setValue(ev.target.value)} value={value} required disabled={Props.disabled} />
			)}
			<p className="error" style={{display: Props.error !== "" ? "block" : "none"}}>{Props.error}</p>
		</>
	)
}

const Podania: FC = () => {
	const context = useContext(UserContext)?.data
	const [steam, setSteam] = useState("")
	const [loading, setLoading] = useState(true)
	const [showPopup, setShowPopup] = useState(false)
	const [popupTitle, setPopupTitle] = useState('')
	const [popupContent, setPopupContent] = useState('')

	const body: any = {
		"author": {
			"reference": useRef<any>(null),
			"error": useState("")
		},
		"nick": {
			"reference": useRef<any>(null),
			"error": useState("")
		},
		"steam": {
			"reference": useRef<any>(null),
			"error": useState("")
		},
		"age": {
			"reference": useRef<any>(null),
			"error": useState("")
		},
		"short": {
			"reference": useRef<any>(null),
			"error": useState("")
		},
		"long": {
			"reference": useRef<any>(null),
			"error": useState("")
		},
	}

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
		Object.values(body).map((v: any) => v.error[1](""));
		let error = false

		if (body.long.reference.current.value.length < 200) return body.long.error[1]("Za krótka odpowiedź");
		if (body.short.reference.current.value.length < 30) return body.short.error[1]("Za krótka odpowiedź");
		if (body.age.reference.current.value < 12 && body.age.reference.current.value > 99) return body.age.error[1]("Błędna odpowiedź");

		Object.values(body).forEach((x: any) => {
			if(x.reference.current.value == "") {
				error = true
				return alert("Uzupełnij wszystkie pola!")
			}
		})

		const final: any = {}
		Object.keys(body).forEach(key => {
			final[key] = body[key].reference.current.value;
		})

		if (error) return

		fetch('/api/docs/upload', {
			body: JSON.stringify(final),
			method: "POST",
			headers: {'Content-Type': 'application/json'}
		}).then(x => x.json()).then(x => {
			console.log(x)
			if (x.code == 400 && x.message == "Bad request") {
				x.problems.forEach((problem: string) => {
					let problemReason = ""
					switch (problem) {
						case "long":
							problemReason = "Za krótkie"
							break;
						case "short":
							problemReason = "Za krótkie"
							break;
						case "age":
							problemReason = "Nieprawidłowy wiek"
							break;
						case "nick":
							problemReason = "Nieprawidłowy nick"
							break;
						case "discord":
							problemReason = "Nieprawidłowe ID"
							break;
						case "steam":
							problemReason = "Nieprawidłowy adres konta steam"
							break;
					}
					body[problem].error[1](problemReason);
				})
			} else if (x.code == 400 && x.message == "Too many active docs") alert("Masz już otwarte 2 podania!")
			else if (x.code == 400 && x.message == "Missing request fields") alert("Uzupełnij wszystkie pola!")
			else alert("OK!")
		})
	}

	return (
		<Container>
			{context?.user !== undefined ? context.user.applicationState ? (
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

							<Input reference={body.author.reference} label="Discord Tag" name="id" placeholder="364056796932997121" value={context.user.userid} error={body.author.error[0]} disabled />
							<Input reference={body.nick.reference} label="Discord Nick" name="nick" placeholder="Wumpus#0000" value={`${context.user.username}#${context.user.tag}`} error={body.nick.error[0]} disabled />
							<Input reference={body.steam.reference} label="Steam URL" name="steam" placeholder="https://steamcommunity.com/id/gabelogannewell" value={steam} error={body.steam.error[0]} />
							<Input reference={body.age.reference} type="number" label="Wiek" name="age" placeholder="Wiek" error={body.age.error[0]} />
							<Input reference={body.short.reference} type="long" label="Krótki opis siebie" name="short" placeholder="..." error={body.short.error[0]} />
							<Input reference={body.long.reference} type="long" label="Dlaczego mamy ciebie wybrać (min. 200 znaków)" placeholder="..." name="long" error={body.long.error[0]} />

							<button onClick={() => upload()}>Wyślij</button>
						</div>
					</div>
				)
			) : (
				<div className="error-401-container">
					<h1>Podania są zamknięte!</h1>
				</div>
			) : (
				<div className="error-401-container">
					<h1>Zaloguj się najpierw!</h1>
				</div>
			)}
		</Container>
	)
}

export default Podania
