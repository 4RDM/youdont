import React, { FC, Suspense, lazy, useEffect, createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom";

// Assets
import "./Global.scss";

// Components
import Loading from "./Components/LoadingComponent";

// Pages
const HomePage = lazy(() => import("./Pages/HomePage"));
const Dashboard = lazy(() => import("./Pages/Dashboard/Index"));
const AdminDashboard = lazy(() => import("./Pages/Dashboard/Admin"));
const Articles = lazy(() => import("./Pages/Articles/Index"));
const Article = lazy(() => import("./Pages/Articles/Article"));
// const Applications = lazy(() => import("./Pages/Applications"));
const Administration = lazy(() => import("./Pages/Administration"));

export type Permission =
	| "MANAGE_USERS"
	| "MANAGE_SHORTS"
	| "MANAGE_DOCS"
	| "MANAGE_FILES"
	| "MANAGE_ARTICLES"
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

export const isAdmin = (user: IUserContext) => {
	if (!user.permissions) return false;
	return	hasPermissions(user, "ADMINISTRATOR")   ||
			hasPermissions(user, "MANAGE_DOCS")     ||
			hasPermissions(user, "MANAGE_FILES")    ||
			hasPermissions(user, "MANAGE_SHORTS")   ||
			hasPermissions(user, "MANAGE_ARTICLES") ||
			hasPermissions(user, "MANAGE_USERS");
};

export const hasPermissions = (user: IUserContext, permission: Permission) => {
	if (!user.permissions) return false;
	return user.permissions.includes("ADMINISTRATOR") || user.permissions.includes(permission);
};

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
					<Suspense fallback={<Loading />}>
						<Routes>
							<Route index element={<HomePage />} />
							<Route path="dashboard">
								<Route index element={<Dashboard />} />
							</Route>
							<Route path="articles">
								<Route index element={<Articles />} />
								<Route path=":id" element={<Article />} />
							</Route>
							{/* <Route path="applications" element={<Applications />} /> */}
							<Route path="administration" element={<Administration />} />
						</Routes>
					</Suspense>
				</UserContext.Provider>
			</div>
		</BrowserRouter>
	);
};

ReactDOM.render(<App />, document.getElementById("App"));