import React, { Component } from 'react'
import { Discord, Github, Steam } from '@styled-icons/fa-brands'

interface Props {}

const cytaty = [
	'"helix drze ryja nie wiem czy działa" ~ Nimplex 2k21',
	'"Revert "dzbam"" ~ Nimplex 2k21',
	'"nie dla psa kiebłasa" ~ Kubamaz 2k21',
	'"/nimplexma2zakola" ~ Nimplex 2k21',
	'"ja z pc lece" ~ Kubamaz 2k22',
	'"ty no słuchaj no" ~ Helix 2k22',
	'"za zero" ~ Helix 2k22',
	'"no co?" ~ Kaliberek 2k22',
	'"Jaki mówiłeś vps? Bo jak nic nie znajdziemy, to ja mogę hostowac" ~ Kubamaz 2k20',
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
							<a href="">
								<Github size={20} />
								Github
							</a>
						</div>
					</div>
					<div>
						<h1>Mapa strony</h1>
						<div className="footer-links">
							<a href="#">Strona główna</a>
							<a href="#">Podania</a>
							<a href="#">Artykuły</a>
							<a href="#">Panel użytkownika</a>
							<a href="#">Za(-Wy)loguj się</a>
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
