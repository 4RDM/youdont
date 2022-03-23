import React, { FC, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Assets
import "./Styles/Container.scss";
import image from "../Public/tloBB.webp";

// Components
import Footer from "./FooterComponent";
import Navbar from "./NavbarComponent";

const Container: FC = (props) => {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			// behavior: "smooth",
		});
	}, [pathname]);

	return (
		<div id="container" style={{ "backgroundImage": pathname == "/" ? `url(${image})` : "none"}}>
			<Navbar />
			<div id="container-content">{props.children}</div>
			<Footer />
		</div>
	);
};

export default Container;