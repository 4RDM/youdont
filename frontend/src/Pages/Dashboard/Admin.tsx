import React, { FC, lazy, Suspense, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { UserContext } from "../../App";

// Components
import Container2 from "../../Components/AdminDashboard/ContainerComponent";
import Container from "../../Components/ContainerComponent";
import Loading from "../../Components/LoadingComponent";

const AdminShorts = lazy(() => import("./AdminShorts"));
const AdminFiles = lazy(() => import("./AdminFiles"));
const AdminApplications = lazy(() => import("./AdminApplications"));
const AdminStats = lazy(() => import("./AdminStats"));
const AdminArticles = lazy(() => import("./AdminArticles"));
const AdminSettings = lazy(() => import("./AdminSettings"));
const LoginComponent = lazy(() => import("../../Components/LoginComponent"));

const AdminDashboard: FC = () => {
	const session = useContext(UserContext);

	return (
		session?.user == undefined ? <Container><LoginComponent /></Container> : (
			<Container2>
				<Suspense fallback={<Loading />}>
					<Routes>
						<Route path="/" element={<AdminStats />} />
						<Route path="applications" element={<AdminApplications />} />
						<Route path="articles" element={<AdminArticles />} />
						<Route path="shorts" element={<AdminShorts />} />
						<Route path="files" element={<AdminFiles />} />
						<Route path="settings" element={<AdminSettings />} />
					</Routes>
				</Suspense>
			</Container2>
		)
	);
};

export default AdminDashboard;