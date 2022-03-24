import React, { FC, Suspense, lazy, useEffect, createContext, useState } from "react";
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

export type Permission =
	| "MANAGE_USERS"
	| "MANAGE_SHORTS"
	| "MANAGE_DOCS"
	| "MANAGE_FILES"
	| "ADMINISTRATOR"

interface IUserContext {
	user?: {
		userid: string
		tag: string
		username: string
		email: string
		avatar: string
		role: string
		applicationState: boolean
	}
	permissions?: Permission[]
}

type State = IUserContext | null;

export const UserContext = createContext<State>({});

const App: FC = () => {
	const [UserState, setUserState] = useState<IUserContext | null>(null);

	useEffect(() => {
		fetch("/api/dashboard/session").then(x => x.json()).then(x => {
			// TODO: handle error
			if (x.code !== 200) return;
			setUserState({
				user: x.user,
				permissions: x.permissions
			});
		});
	}, []);

	return (
		<BrowserRouter>
			<div className="App">
				<UserContext.Provider value={UserState}>
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
				</UserContext.Provider>
			</div>
		</BrowserRouter>
	);
};

ReactDOM.render(<App />, document.getElementById("App"));