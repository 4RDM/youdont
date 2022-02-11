import React, { FC, useContext, useRef, useState } from 'react'
import Container from '../components/Container'
import Popup from '../components/popup'
import { UserContext } from '../utils/UserContext'

import './FileUploader.scss'

const FileUploader: FC = () => {
	const context = useContext(UserContext)?.data
	const [showPopup, setShowPopup] = useState(false)
	const [popupTitle, setPopupTitle] = useState('')
	const [popupContent, setPopupContent] = useState('')
	const fileInput = useRef<HTMLInputElement>(null)
	const [files, setFiles] = useState<File[]>([])

	const handleChange = () => {
		if (!fileInput.current?.files || !fileInput.current.files) return
		setFiles([...files, ...Object.values(fileInput.current.files)])
	}

	const handleSubmit = (
		ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		ev.preventDefault()

		if (!files || !files[0]) {
			setPopupContent('Wybierz najpierw plik!')
			setPopupTitle('❌ Błąd!')
			setShowPopup(true)
			return
		}

		const form = new FormData()
		files.forEach((file: any) => {
			form.append('file', file)
		})

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
					console.log(x)
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
						<div className="content">
							{ /* prettier-ignore */}
							<input type="file" name="file" id="file" ref={fileInput} onChange={handleChange} multiple/>
							<div className="buttons">
								{ /* prettier-ignore */}
								<button onClick={() => fileInput.current?.click()}>Dodaj plik</button>
								{ /* prettier-ignore */}
								<button onClick={(ev) => handleSubmit(ev)}>Wyślij</button>
							</div>
							<div className="files-list">
								{files.map((file) => (
									<h1>{file.name}</h1>
								))}
							</div>
						</div>
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
