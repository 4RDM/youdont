import React, { FC, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { UserContext } from "../../App";

// Components
import Container2 from "../../Components/AdminDashboard/ContainerComponent";
import Container from "../../Components/ContainerComponent";

import AdminShorts from "./AdminShorts";
import AdminFiles from "./AdminFiles";
import AdminApplications from "./AdminApplications";
import AdminStats from "./AdminStats";
import AdminArticles from "./AdminArticles";
import AdminSettings from "./AdminSettings";
import LoginComponent from "../../Components/LoginComponent";

const AdminDashboard: FC = () => {
	const session = useContext(UserContext);

	return (
		session?.user == undefined ? <Container><LoginComponent /></Container> : (
			<Container2>
				<Routes>
					<Route path="/" element={<AdminStats />} />
					<Route path="applications" element={<AdminApplications />} />
					<Route path="articles" element={<AdminArticles />} />
					<Route path="shorts" element={<AdminShorts />} />
					<Route path="files" element={<AdminFiles />} />
					<Route path="settings" element={<AdminSettings />} />
				</Routes>
			</Container2>
		)
	);
};

export default AdminDashboard;