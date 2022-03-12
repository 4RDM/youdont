import { X } from '@styled-icons/bootstrap'
import React, { FC } from 'react'

const Popup: FC<{ content: string; title: string; handleClose: () => void }> = (props) => {
	return (
		<div className="popup">
			<div className="popup-container">
				<div className="popup-header">
					<h1>{props.title}</h1>
					<span className="close-icon" onClick={props.handleClose}><X /></span>
				</div>
				{props.content}
			</div>
		</div>
	)
}

export default Popup
