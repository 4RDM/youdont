import React, { FC, useState } from 'react'
import { Eye, X } from '@styled-icons/bootstrap'

interface Props {
	podanie: {
		author: string
		reason: string
		id: string
		date: Date
		approved: boolean
		admin: string
	}
}

const PodanieCard: FC<Props> = (props) => {
	const [open, setOpen] = useState(false)

	const changeState = () => setOpen(!open)

	return (
		<div className="podanie-card">
			<div className="podanie-container">
				<h1>#{props.podanie.id}</h1>
				<button onClick={changeState}>
					<p>
						{props.podanie.approved ? 'Zaakceptowane' : 'Odrzucone'}
					</p>
					{!open ? <Eye size={20} /> : <X size={20} />}
				</button>
			</div>
			{open ? (
				<div className="podanie-details">
					<div>
						<p>Administrator</p>
						<h1>{props.podanie.admin}</h1>
					</div>
					{!props.podanie.approved ? (
						<div>
							<p>Powód</p>
							<h1>{props.podanie.reason}</h1>
						</div>
					) : null}
					<div>
						<p>Data</p>
						<h1>{props.podanie.date.toLocaleString()}</h1>
					</div>
				</div>
			) : null}
		</div>
	)
}

export default PodanieCard
