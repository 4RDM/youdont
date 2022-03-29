import React, { FC } from "react";

import "./Styles/HomePage.scss";
import Container from "../Components/ContainerComponent";

const HomePage: FC = () => {
	return (
		<Container>
			<div id="homepage-container">
				<h1>4RDM</h1>
				<p>Serwer tworzony dla ciebie!</p>
			</div>
		</Container>
	);
};

export default HomePage;