import React, { Component } from 'react'

export default class Footer extends Component {
	render() {
		return (
			<div id="footer">
				<div>
					<p>Znajdź nas</p>
					<div className="footer-content">
						<a href="https://discord.4rdm.pl">
							<i className="bx bxl-discord-alt"></i>
							Discord
						</a>
						<a href="https://steamcommunity.com/groups/4rdm">
							<i className="bx bxl-steam"></i>
							Steam
						</a>
						<a href="https://github.com/4RDM">
							<i className="bx bxl-github "></i>
							Github
						</a>
					</div>
				</div>
				<div>
					<p>Nasza Strona</p>
				</div>
				<div>
					<p>Dodatkowe</p>
				</div>
			</div>
		)
	}
}
