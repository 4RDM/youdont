import React, { FC, useEffect, useState } from 'react'
import LazyLoad from 'react-lazyload'
import Container from '../components/Container'
import { PulseLoader as PL } from 'react-spinners'
import { Card } from '../components/Card'

const Home: FC = () => {
	const [admins, setAdmins] = useState({ admins: [] })
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetch('/api/dashboard/admins')
			.then((x) => x.json())
			.then((x) => {
				if (x.code == 401) return
				setAdmins(x.admins)
				setLoading(false)
			})
	}, [])

	return (
		<Container>
			<div id="administration-container">
				{
					/* prettier-ignore */
					loading ? (<div id="TOP_LOADING"><PL color="white" size="30px" /></div>) : (
					admins.admins.map((admin: any) => {
						return (
							<Card key={admin.id}>
								<h1>{admin.role.name}</h1>
								<LazyLoad once>
									<img crossOrigin="anonymous" src={admin.avatar} width="100%" alt="avatar" />
								</LazyLoad>
								<p>{admin.nickname}</p>
							</Card>
						)
					})
				)
				}
			</div>
		</Container>
	)
}

export default Home
