import { Eye } from '@styled-icons/bootstrap/Eye'
import { X } from '@styled-icons/bootstrap/X'
import React, { FC, useState } from 'react'

interface Props {
	podanie: {
		author: string
		reason: string
		id: string
		date: number
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
			{open &&
				<div className="podanie-details">
					<div>
						<p>Administrator</p>
						<h1>{props.podanie.admin}</h1>
					</div>
					{!props.podanie.approved &&
						<div>
							<p>Powód</p>
							<h1>{props.podanie.reason}</h1>
						</div>
					}
					<div>
						<p>Data</p>
						<h1>{new Date(props.podanie.date).toLocaleString()}</h1>
					</div>
				</div>
			}
		</div>
	)
}

export default PodanieCard
