import React, { FC, useEffect, useState } from 'react'
import LazyLoad from 'react-lazyload'
import Container from '../components/Container'
import { PulseLoader as PL } from 'react-spinners'
import { Card } from '../components/Card'

interface Roles {
	[index: string]: [
		{
			nickname: string
			avatar: string
			id: string
		}?
	]
}

const Home: FC = () => {
	const [roles, setRoles] = useState<Roles>({})
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetch('/api/dashboard/admins')
			.then((x) => x.json())
			.then((x) => {
				if (x.code == 401) return
				setRoles(x.admins.roles)
				setLoading(false)
			})
	}, [])

	return (
		<Container>
			<div id="administration-container">
				{loading ? (<div id="TOP_LOADING"><PL color="white" size="30px" /></div>) : (
					Object.keys(roles).map((role) => {
						return (
							<div className='administration-column' key={role}>
								<h1>{role}</h1>
								<div className='administration-row' key={role}>
									{roles[role].map((admin) => <Card key={admin?.id}><h1>{admin?.nickname}</h1><LazyLoad once><img crossOrigin="anonymous" src={admin?.avatar} width="100%" alt="avatar" /></LazyLoad></Card>)}
								</div>
							</div>
						)
					})
				)}
			</div>
		</Container>
	)
}

export default Home
