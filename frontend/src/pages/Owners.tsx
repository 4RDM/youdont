import React, { FC, useEffect, useState } from 'react'
import Container from '../components/Container'
import { Card } from '../components/Card'
import { Globe } from '@styled-icons/entypo/Globe'
import { Youtube } from '@styled-icons/fa-brands/Youtube'
import { Twitter } from '@styled-icons/fa-brands/Twitter'

const Owners: FC = () => {
const [kubamaz, setKubamaz] = useState("");
const [nimplex, setNimplex] = useState("");
const [demons, setDemon] = useState("");
const [helix, setHelix] = useState("");
useEffect(() => {
fetch("/api/dashboard/admins").then(x => x.json()).then(x => {
x.admins.roles.map((v) => {
v.map(user => {
if (user.nickname == "Nimplex#1010") { 
setNimplex(user.avatar);
alert(JSON.stringify(user))
}
if (user.nickname == "Kubamaz#7775") setKubamaz(user.avatar);
if (user.nickname == "DemonS#2581") setDemon(user.avatar);
if (user.nickname == "Helix_#6666") setHelix(user.avatar)
})
})
})
},[])
	return (
		<Container>
			<div id="owners-container">
				<h1>Projekt tworzą:</h1>
				<div>
					<div>
						<Card>
							<div className="info">
								<h1>Jakub Wójcik</h1>
								<p>Kubamaz</p>
								<p className="opis">Założyciel i jeden z właścicieli projektu 4RDM. Zajmuje się głównie stroną techniczną serwera FiveM i zarządzaniem społecznością</p>
								<div className="social">
									<a href="https://beta.4rdm.pl"><Globe/></a>
									<a href="https://www.youtube.com/channel/UC1MAKabw8zqgG5KzBryyaXg"><Youtube/></a>
								</div>
							</div>
							<div className="avatar">
								<img src={kubamaz} crossOrigin="anonymous" />
							</div>
						</Card>
						<Card>
							<div className="info">
								<h1>Przemysław Szafraniec</h1>
								<p>Nimplex</p>
								<p className="opis">Założyciel i jeden z właścicieli projektu. Zajmuje się głownie stroną techniczną całego projektu, w tym: zarządzaniem serwerami, tworzeniem rozwiązań technicznych i rozwiązywaniem problemów natury programistycznej.</p>
								<div className="social">
									<a href="https://nimplex.xyz"><Globe/></a>
									<a href="https://www.youtube.com/c/Nimplex"><Youtube/></a>
									<a href="https://www.twitter.com/Nimplexy"><Twitter/></a>
								</div>
							</div>
							<div className="avatar">
								<img src={nimplex} crossOrigin="anonymous" />
							</div>
						</Card>
					</div>
					<div>
						<Card>
							<div className="info">
								<h1>Alan Pukownik</h1>
								<p>Helix</p>
								<p className="opis">Członek zarządu, zajmuje się pilnowaniem pracy reszty członków projektu, projektowaniem grafiki i doradza właścicielom podczas dokonywania różnych wyborów. Pomaga właścicielom wprowadzać w życie nowe pomysły i testować nowe rozwiązania.</p>
								<div className="social"></div>
							</div>
							<div className="avatar">
								<img src={helix} crossOrigin="anonymous" />
							</div>
						</Card>
						<Card>
							<div className="info">
								<h1>Jakub Dekert</h1>
								<p>DemonS</p>
								<p className="opis">Członek zarządu, pomaga właścicielom w różnych zadaniach i pomaga utrzymywać porządek w całej drużynie. Często podejmuje z właścicielami rozwojowe decyzje.</p>
								<div className="social"></div>
							</div>
							<div className="avatar">
								<img src={demons} crossOrigin="anonymous" />
							</div>
						</Card>
					</div>
				</div>
			</div>
		</Container>
	)
}

export default Owners
