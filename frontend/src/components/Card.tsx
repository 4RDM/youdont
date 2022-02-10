import React, { FC } from 'react'

export const Card: FC = (props) => {
	return <div className="card">{props.children}</div>
}
