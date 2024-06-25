import React, { useState } from "react";
import { Discord } from "@styled-icons/fa-brands/Discord";
import { Github } from "@styled-icons/fa-brands/Github";
import { Steam } from "@styled-icons/fa-brands/Steam";
import { Tiktok } from "@styled-icons/fa-brands/Tiktok";

import "./Footer.scss";
import { Link } from "react-router-dom";

const cytaty = [
	'"helix drze ryja nie wiem czy działa" ~ Nimplex 2021',
	'"predzej zmienie sie w alternatywke niz lola odpale" ~ K3IX 2023',
	'"Revert "dzbam"" ~ Nimplex 2021',
	'"nie dla psa kiebłasa" ~ K3IX 2021',
	'"ty no majster" ~ DemonS 2021',
	'"ODDAJ MI MOJE RANGI" ~ Helix 2021',
	'"/nimplexma2zakola" ~ Nimplex 2021',
	'"ja z pc lece" ~ K3IX 2022',
	'"ty no słuchaj no" ~ Helix 2022',
	'"za zero" ~ Helix 2022',
	'"nie działa" ~ Helix 2021',
	'"Zabij sie" ~ K3IX 2021',
	'"Jaki mówiłeś vps? Bo jak nic nie znajdziemy, to ja mogę hostowac" ~ Kubamaz 2019/20',
	'"Litwo, Ojczyzno moja! ty jesteś jak zdrowie, Ile cię trzeba cenić, ten tylko się dowie, Kto cię stracił. Dziś piękność twą w całej ozdobie Widzę i opisuję, bo tęsknię po tobie." ~ Adam Mickiewicz 1834',
];

export default () => {
	const [cytat] = useState(cytaty[Math.floor(Math.random() * cytaty.length)]);

	return (
		<footer>
			<div id="footer-container">
				<div>
					<h1>Cytat</h1>
					<p>{cytat}</p>
				</div>
				<div>
					<h1>Linki</h1>
					<a href="https://discord.4rdm.pl">
						<Discord size={20} /> Discord
					</a>
					<a href="https://steamcommunity.com/groups/4rdm">
						<Steam size={20} /> Steam
					</a>
					<a href="https://github.com/4RDM">
						<Github size={20} /> Github
					</a>
				       	<a href="https://tiktok.com/@4rdm.pl">
						<Tiktok size={20} /> TikTok
					</a>
	
                                </div>
				<div>
					<h1>Mapa strony</h1>
					<Link to="/">Strona główna</Link>
					<Link to="/articles">Artykuły</Link>
					<Link to="/administration">Administracja</Link>
					<Link to="/dashboard">Panel użytkownika</Link>
				</div>
				<div>
					<p id="footer-author">
						4RDM © 2020-{new Date().getFullYear()}, made by{" "}
						<a href="https://github.com/Nimplex">Nimplex</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
