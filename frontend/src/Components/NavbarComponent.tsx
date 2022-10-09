import React, { FC, useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../App";

const Navbar: FC = () => {
	const location = useLocation();
	const session = useContext(UserContext);
	const [screenWidth, setScreenWidth] = useState(window.innerWidth);
	const [toggle, setToggle] = useState(false);

	const PanelOrLogout = session !== null ? location.pathname == "/dashboard" ? <a href="/api/dashboard/logout">Wyloguj Się</a> : <Link to="/dashboard">Panel użytkownika</Link> : <a href="/api/dashboard/login">Zaloguj się</a>;
	const toggleMenu = () => setToggle(!toggle);

	useEffect(() => {
		const resizeListener = () => setScreenWidth(window.innerWidth);
		window.addEventListener("resize", resizeListener);
		return () => window.removeEventListener("resize", resizeListener);
	}, []);

	useEffect(() => setToggle(false), [location.pathname]);

	return (
		<div id="container-navbar">
			<Link to="/"><h1 id="container-navbar-title">4RDM</h1></Link>
			{screenWidth > 720 ? (
				<div>
					<Link to="/">Strona główna</Link>
					<Link to="/administration">Administracja</Link>
					<Link to="/articles">Artykuły</Link>
					{PanelOrLogout}
				</div>
			): (
				<>
					{toggle &&
						<div id="container-navbar-menu">
							<button onClick={toggleMenu}>×</button>
							<div>
								<Link to="/">Strona główna</Link>
								<Link to="/administration">Administracja</Link>
								<Link to="/articles">Artykuły</Link>
								{PanelOrLogout}
							</div>
						</div>
					}
					<button onClick={toggleMenu}>≡</button>
				</>
			)}
		</div>
	);
};

export default Navbar;