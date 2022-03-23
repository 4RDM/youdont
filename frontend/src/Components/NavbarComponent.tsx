import React, { FC, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: FC = () => {
	const location = useLocation();
	const [screenWidth, setScreenWidth] = useState(window.innerWidth);
	const [toggle, setToggle] = useState(false);

	const PanelOrLogout = location.pathname == "/dashboard" ? <a href="/api/dashboard/logout">Wyloguj Się</a> : <Link to="/dashboard">Panel użytkownika</Link>;
	const toggleMenu = () => setToggle(!toggle);

	useEffect(() => {
		const resizeListener = () => setScreenWidth(window.innerWidth);
		window.addEventListener("resize", resizeListener);
		return () => window.removeEventListener("resize", resizeListener);
	}, []);


	useEffect(() => setToggle(false), [location.pathname]);

	return (
		<div id="container-navbar">
			<h1 id="container-navbar-title">4RDM</h1>
			{screenWidth > 720 ? (
				<div>
					<Link to="/">Strona główna</Link>
					<Link to="/administration">Administracja</Link>
					<Link to="/articles">Artykuły</Link>
					<Link to="/applications">Podania</Link>
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
								<Link to="/applications">Podania</Link>
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