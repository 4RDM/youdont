import React, { Component } from 'react'
import { Discord, Github, Steam } from '@styled-icons/fa-brands'
import { Link } from 'react-router-dom'

interface Props {}

const cytaty = [
	'"helix drze ryja nie wiem czy działa" ~ Nimplex 2021',
	'"Revert "dzbam"" ~ Nimplex 2021',
	'"nie dla psa kiebłasa" ~ Kubamaz 2021',
	'"/nimplexma2zakola" ~ Nimplex 2021',
	'"ja z pc lece" ~ Kubamaz 2022',
	'"ty no słuchaj no" ~ Helix 2022',
	'"za zero" ~ Helix 2022',
	'"no co?" ~ Kaliberek 2022',
	'"Jaki mówiłeś vps? Bo jak nic nie znajdziemy, to ja mogę hostowac" ~ Kubamaz 2020',
	'"Litwo, Ojczyzno moja! ty jesteś jak zdrowie, Ile cię trzeba cenić, ten tylko się dowie, Kto cię stracił. Dziś piękność twą w całej ozdobie Widzę i opisuję, bo tęsknię po tobie." ~ Adam Mickiewicz 1834',
]

export default class Footer extends Component<Props, any> {
	constructor(props: Props) {
		super(props)

		this.state = {
			cytat: cytaty[Math.floor(Math.random() * cytaty.length)],
		}
	}
	render() {
		return (
			<div id="footer">
				<div id="footer-content">
					<div id="cytat">
						<h1>Cytat</h1>
						<p>{this.state.cytat}</p>
					</div>
					<div>
						<h1>Linki</h1>
						<div className="footer-links">
							<a href="https://discord.4rdm.pl">
								<Discord size={20} />
								Discord
							</a>
							<a href="https://steamcommunity.com/groups/4rdm">
								<Steam size={20} />
								Steam
							</a>
							<a href="https://github.com/4RDM">
								<Github size={20} />
								Github
							</a>
						</div>
					</div>
					<div>
						<h1>Mapa strony</h1>
						<div className="footer-links">
							<Link to="/">Strona główna</Link>
							<Link to="/articles">Artykuły</Link>
							<Link to="/">Podania</Link>
							<a href="/dashboard">Panel użytkownika</a>
						</div>
					</div>
				</div>
				<div id="footer-bottom">
					4RDM &copy; 2020-2022, made by{' '}
					<a href="https://github.com/Nimplex">Nimplex</a>.
				</div>
			</div>
		)
	}
}
