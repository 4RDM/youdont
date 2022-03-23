import React, { FC, Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ReactDOM from "react-dom";

// Assets
import "./Global.scss";

// Components
import Loading from "./Components/LoadingComponent";
import Container from "./Components/ContainerComponent";

// Pages
const HomePage = lazy(() => import("./Pages/HomePage"));
const Dashboard = lazy(() => import("./Pages/Dashboard/Index"));
const AdminDashboard = lazy(() => import("./Pages/Dashboard/Admin"));
const AdminApplications = lazy(() => import("./Pages/Dashboard/AdminApplications"));
const AdminStats = lazy(() => import("./Pages/Dashboard/AdminStats"));
const AdminArticles = lazy(() => import("./Pages/Dashboard/AdminArticles"));
const Articles = lazy(() => import("./Pages/Articles/Index"));
const Article = lazy(() => import("./Pages/Articles/Article"));
const Applications = lazy(() => import("./Pages/Applications"));

const App: FC = () => {
	return (
		<BrowserRouter>
			<div className="App">
				<Container>
					<Suspense fallback={<Loading />}>
						<Routes>
							<Route index element={<HomePage />} />
							<Route path="dashboard">
								<Route index element={<Dashboard />} />
								<Route path="admin">
									<Route index element={<AdminDashboard />} />
									<Route path="applications" element={<AdminApplications />} />
									<Route path="stats" element={<AdminStats />} />
									<Route path="articles" element={<AdminArticles />} />
								</Route>
							</Route>
							<Route path="articles">
								<Route index element={<Articles />} />
								<Route path=":id" element={<Article />} />
							</Route>
							<Route path="applications" element={<Applications />} />
						</Routes>
					</Suspense>
				</Container>
			</div>
		</BrowserRouter>
	);
};

ReactDOM.render(<App />, document.getElementById("App"));