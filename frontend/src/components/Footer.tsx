import { Discord } from '@styled-icons/fa-brands/Discord'
import { Github } from '@styled-icons/fa-brands/Github'
import { Steam } from '@styled-icons/fa-brands/Steam'
import React, { FC, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Permission, UserContext } from '../utils/UserContext'

const cytaty = [
	'"helix drze ryja nie wiem czy działa" ~ Nimplex 2021',
	'"Revert "dzbam"" ~ Nimplex 2021',
	'"nie dla psa kiebłasa" ~ Kubamaz 2021',
	'"ty no kurwa majster" ~ DemonS 2021',
	'"KURWA ODDAJ MI MOJE RANGI" ~ Helix 2021',
	'"/nimplexma2zakola" ~ Nimplex 2021',
	'"ja z pc lece" ~ Kubamaz 2022',
	'"ty no słuchaj no" ~ Helix 2022',
	'"za zero" ~ Helix 2022',
	'"I fuck your mama last night" ~ Helix 2021',
	'"Kurwa nie działa" ~ Helix 2021',
	'"Zabij sie" ~ Kubamaz 2021',
	'"no co?" ~ Kaliberek 2022',
	'"Jaki mówiłeś vps? Bo jak nic nie znajdziemy, to ja mogę hostowac" ~ Kubamaz 2020',
	'"Litwo, Ojczyzno moja! ty jesteś jak zdrowie, Ile cię trzeba cenić, ten tylko się dowie, Kto cię stracił. Dziś piękność twą w całej ozdobie Widzę i opisuję, bo tęsknię po tobie." ~ Adam Mickiewicz 1834',
]

const Footer: FC = (props) => {
	const context = useContext(UserContext)?.data
	const cytat = cytaty[Math.floor(Math.random() * cytaty.length)]

	const hasPermissions = (permission: Permission) =>
		context?.permissions.includes(permission) ||
		context?.permissions.includes('ADMINISTRATOR')

	return (
		<div id="footer">
			<div id="footer-content">
				<div id="cytat">
					<h1>Cytat</h1>
					<p>{cytat}</p>
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
						<Link to="/administration">Administracja</Link>
						{
							/* prettier-ignore */ hasPermissions('MANAGE_DOCS') && <Link to="/docs">Sprawdzanie podań</Link>
						}
						{
							/* prettier-ignore */ hasPermissions('MANAGE_SHORTS') && <Link to="/short">Skracanie linków</Link>
						}
						{
							/* prettier-ignore */ hasPermissions('MANAGE_FILES') && <Link to="/files">Wrzuć pliki</Link>
						}
						{
							/* prettier-ignore */ hasPermissions('MANAGE_FILES') && <a href="/api/files">Przeglądaj pliki</a>
						}
						<Link to="/podania">Podania</Link>
						<Link to="/panel">Panel użytkownika</Link>
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

export default Footer
