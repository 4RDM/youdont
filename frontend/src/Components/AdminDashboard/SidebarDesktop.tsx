import React, { FC } from "react";
import { useLocation, Link } from "react-router-dom";

import { PieChart } from "@styled-icons/entypo/PieChart";
import { Folder } from "@styled-icons/entypo/Folder";
import { Image } from "@styled-icons/entypo/Image";
import { Man } from "@styled-icons/entypo/Man";
import { Link as Lin } from "@styled-icons/entypo/Link";
import { Switch } from "@styled-icons/entypo/Switch";
import { LogOut } from "@styled-icons/entypo/LogOut";
import { ArrowLeft } from "@styled-icons/entypo";

const SidebarDesktop: FC = (props) => {
	const { pathname } = useLocation();

	return (
		<div id="sidebar-desktop">
			<a href="/" id="sidebar-desktop-back"><ArrowLeft /></a>
			{/* <div className="separator"></div> */}
			<Link to="/dashboard/admin" className={pathname.endsWith("admin") ? "active" : ""}><PieChart /></Link>
			<Link to="applications" className={pathname.endsWith("applications") ? "active" : ""}><Man /></Link>
			<Link to="articles" className={pathname.endsWith("articles") ? "active" : ""}><Image /></Link>
			<Link to="shorts" className={pathname.endsWith("shorts") ? "active" : ""}><Lin /></Link>
			<Link to="files" className={pathname.endsWith("files") ? "active" : ""}><Folder /></Link>
			{/* <div className="separator"></div> */}
			<Link to="settings" className={pathname.endsWith("settings") ? "active" : ""}><Switch /></Link>
			<a href="/api/dashboard/logout"><LogOut /></a>
		</div>
	);
};

export default SidebarDesktop;