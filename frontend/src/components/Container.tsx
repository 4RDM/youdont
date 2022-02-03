import React, { CSSProperties, FC } from 'react'
import Footer from './Footer'
import Navbar from './Navbar'

interface Props {
	style?: CSSProperties
	id?: string
}

const Container: FC<Props> = (props) => {
	return (
		<div style={props.style} id={props.id}>
			<Navbar></Navbar>
			<div id="content">{props.children}</div>
			<Footer></Footer>
		</div>
	)
}

export default Container
