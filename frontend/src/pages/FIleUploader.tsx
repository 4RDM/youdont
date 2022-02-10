import React, { FC, useContext, useState } from 'react'
import Container from '../components/Container'
import Popup from '../components/popup'
import { UserContext } from '../utils/UserContext'

import './FileUploader.scss'

const FileUploader: FC = () => {
	const context = useContext(UserContext)?.data
	const [showPopup, setShowPopup] = useState(false)
	const [popupTitle, setPopupTitle] = useState('')
	const [popupContent, setPopupContent] = useState('')

	const handleSubmit = (
		ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		ev.preventDefault()

		// @ts-ignore
		const input: HTMLInputElement = document.getElementById('file')
		if (!input.files || !input.files[0]) {
			setPopupContent('Wybierz najpierw plik!')
			setPopupTitle('❌ Błąd!')
			setShowPopup(true)
			return
		}

		const form = new FormData()
		form.append('file', input.files[0])

		try {
			fetch('/api/files/upload', {
				method: 'POST',
				body: form,
			})
				.then((x) => x.json())
				.then((x) => {
					if (x.code !== 200) {
						setPopupContent('Nieznany błąd serwera!')
						setPopupTitle('❌ Błąd!')
						setShowPopup(true)
						return
					}
					setPopupContent(
						`Pomyślnie wrzucono plik na serwer, jest dostępny pod adresem: ${x.url}`
					)
					setPopupTitle('🎉 Tada!')
					setShowPopup(true)
				})
		} catch (err) {
			setPopupContent('Nieznany błąd serwera!')
			setPopupTitle('❌ Błąd!')
			setShowPopup(true)
		}
	}

	return (
		<Container>
			{context?.user !== undefined ? (
				context.permissions.includes('ADMINISTRATOR') ||
				context.permissions.includes('MANAGE_FILES') ? (
					<div id="container">
						{showPopup && (
							<Popup
								title={popupTitle}
								content={popupContent}
								handleClose={() => setShowPopup(!showPopup)}
							/>
						)}
						<form>
							<input type="file" name="file" id="file" />
							<button onClick={(ev) => handleSubmit(ev)}>
								Wyślij
							</button>
						</form>
					</div>
				) : (
					<div className="error-401-container">
						<h1>Nie posiadasz uprawnień do tej strony.</h1>
					</div>
				)
			) : (
				<div className="error-401-container">
					<h1>Zaloguj się najpierw!</h1>
				</div>
			)}
		</Container>
	)
}

export default FileUploader
