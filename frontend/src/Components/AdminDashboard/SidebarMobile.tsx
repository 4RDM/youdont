import { Link, useLocation } from "react-router-dom";
import React, { FC, useEffect, useState } from "react";

import { PieChart } from "@styled-icons/entypo/PieChart";
import { Folder } from "@styled-icons/entypo/Folder";
import { Image } from "@styled-icons/entypo/Image";
import { Man } from "@styled-icons/entypo/Man";
import { Link as Lin } from "@styled-icons/entypo/Link";
import { Switch } from "@styled-icons/entypo/Switch";
import { LogOut } from "@styled-icons/entypo/LogOut";
import { Menu } from "@styled-icons/entypo/Menu";
import { Cross } from "@styled-icons/entypo/Cross";

const SidebarMobile: FC = (props) => {
	const [open, setOpen] = useState(false);
	const { pathname } = useLocation();

	useEffect(() => {
		setOpen(false);
	}, [pathname]);

	return (
		<>
			<div id="sidebar-mobile" className={!open ? "visible" : "novisible"}>
				<h1>4RDM</h1>
				<Menu onClick={() => setOpen(!open)}/>
			</div>
			<div id="sidebar-mobile-visible" className={open ? "visible" : "novisible"}>
				<a onClick={() => setOpen(!open)}><Cross />Zamknij</a>
				<div className="sidebar-category">
					<p className="sidebar-spacer">Ogólne</p>
					<Link to="/dashboard/admin" className={pathname.endsWith("admin") ? "active" : ""}><PieChart />Statystyki</Link>
					<Link to="applications" className={pathname.endsWith("applications") ? "active" : ""}><Man />Podania</Link>
					<Link to="articles" className={pathname.endsWith("articles") ? "active" : ""}><Image />Artykuły</Link>
					<Link to="shorts" className={pathname.endsWith("shorts") ? "active" : ""}><Lin />Skracanie linków</Link>
					<Link to="files" className={pathname.endsWith("files") ? "active" : ""}><Folder />Pliki</Link>
				</div>
				<div className="sidebar-category">
					<p className="sidebar-spacer">Twoje konto</p>
					<Link to="settings" className={pathname.endsWith("settings") ? "active" : ""}><Switch />Ustawienia konta</Link>
					<a href="/api/dashboard/logout"><LogOut />Wyloguj się</a>
				</div>
			</div>
		</>
	);
};

export default SidebarMobile;