import React, { FC, useEffect, useState } from "react";

// Compontents
import SidebarDesktop from "./SidebarDesktop";
import SidebarMobile from "./SidebarMobile";

// Assets
import "./Styles/Container.scss";

const Container: FC = (props) => {
	const [screenWidth, setWidth] = useState(window.innerWidth);

	useEffect(() => {
		const resizeListener = () => setWidth(window.innerWidth);
		window.addEventListener("resize", resizeListener);
		return () => window.removeEventListener("resize", resizeListener);
	}, []);
	
	return (
		<div id="admin-container">
			{screenWidth > 720 ? <SidebarDesktop /> : <SidebarMobile />}
			<div id="admin-container-content">{props.children}</div>
		</div>
	);
};

export default Container;