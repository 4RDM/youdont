import React, { FC, useContext, useEffect, useState } from 'react'
import { PulseLoader as PL } from 'react-spinners'
import Container from '../components/Container'
import { UserContext } from '../utils/UserContext'
import Popup from '../components/Popup'
import { Card } from '../components/Card'
import { EyeFill } from '@styled-icons/bootstrap/EyeFill'

export interface Doc {
	author: string
	approver: string
	approved: boolean
	date: Date
	active: boolean
	reason: string
	nick: string
	age: number
	voice: number
	long: string
	short: string
	steam: string
	docID: string
	_id: string
}

const AdminDocs: FC = () => {
	const context = useContext(UserContext)?.data
	const [loadingDocs, setLoadingDocs] = useState(true)
	const [docs, setDocs] = useState<Doc[]>([])
	const [application, setApplication] = useState<Doc>()
	const [display, setDisplay] = useState<boolean>(false)
	const [showPopup, setShowPopup] = useState(false)
	const [popupTitle, setPopupTitle] = useState('')
	const [popupContent, setPopupContent] = useState('')

	const err = () => {
		setPopupContent('Nieznany błąd serwera!')
		setPopupTitle('❌ Błąd!')
		setShowPopup(true)
	}

	const showApplication = (docID: string) => {
		const application = docs.find((doc) => doc.docID == docID);
		if (!application) return;
		setApplication(application);
		setDisplay(true);
	}

	const refetch = () => fetch('/api/docs/docs')
							.then((x) => x.json())
							.then((x) => {
								if (x.code !== 200) return err()
								setDocs(x.data)
								setLoadingDocs(false)
							})
							.catch(err)

	useEffect(() => {
		if (context?.user == undefined) return
		else refetch()
	}, [context])

	const zaakceptuj = (docID: string) => {
		setDisplay(false)
		fetch(`/api/docs/doc/${docID}/accept`, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(x => x.json()).then(x => {
			if (x.code !== 200) return err()
			else refetch()
		})
	}

	const odrzuc = (docID: string) => {
		const reason = prompt("Powód", "Odrzucony przez wyższą administrację")

		if (!reason) return

		setDisplay(false)

		fetch(`/api/docs/doc/${docID}/reject`, {
			method: "POST",
			body: JSON.stringify({ reason }),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(x => x.json()).then(x => {
			console.log(x);
			if (x.code !== 200) return err()
			else refetch()
		})
	}

	return (
		display && (
			<div id="wholescreenpopup">
				<h1>Podanie {application?.nick}</h1>
				<button className="close" onClick={() => setDisplay(false)}>Zamknij</button>

				<label htmlFor="nick">Nick</label>
				<input type="text" name="nick" id="nick" value={application?.nick} disabled/>

				<label htmlFor="id">Discord ID</label>
				<input type="text" name="id" id="id" value={application?.author} disabled/>

				<label htmlFor="age">Wiek</label>
				<input type="text" name="age" id="age" value={application?.age} disabled/>

				<label htmlFor="steam">Steam</label>
				<input type="text" name="steam" id="steam" value={application?.steam} disabled/>

				<label htmlFor="short">Krótki opis</label>
				<textarea name="short" id="short" value={application?.short} disabled/>

				<label htmlFor="short">Długi opis</label>
				<textarea name="short" id="short" value={application?.long} disabled/>

				<div id="wholescreen-buttons" style={{display: application?.approver == "" ? "grid" : "none"}}>
					{ /* @ts-ignore */ }
					<button className="zaakceptuj" onClick={() => zaakceptuj(application.docID)}>Zaakceptuj</button>
					{ /* @ts-ignore */ }
					<button className="odrzuc" onClick={() => odrzuc(application.docID)}>Odrzuć</button>
				</div>
			</div>
		) || (
			<Container>
				{(context?.user !== undefined && (
					loadingDocs ? (<div id="TOP_LOADING"><PL color="white" size="30px" /></div>) : (
						<div id="admin-panel-container">
							{showPopup && (
								<Popup
									title={popupTitle}
									content={popupContent}
									handleClose={() => setShowPopup(!showPopup)}
								/>
							)}
								<div className="left">
									<h1>Podania sprawdzone</h1>
									<div className="border"></div>
									<div>
										{docs.filter((doc) => doc.approver !== "").map((doc) =>
											<Card key={doc._id}>
												<div>
													<h2>{doc.nick}</h2>
													<p>{doc.approved ? "Przyjęty" : "Odrzucony"}: {doc.approver}</p>
												</div>
												<button onClick={() => showApplication(doc.docID)}><EyeFill></EyeFill></button>
											</Card>
										)}
									</div>
								</div>
								<div className="right">
									<h1>Podania do sprawdzenia</h1>
									<div className="border"></div>
									<div>
										{docs.filter((doc) => doc.approver == "").map((doc) =>
											<Card key={doc._id}>
												<h2>{doc.nick}</h2>
												<button onClick={() => showApplication(doc.docID)}><EyeFill></EyeFill></button>
											</Card>
										)}
									</div>
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
	)
}

export default AdminDocs
