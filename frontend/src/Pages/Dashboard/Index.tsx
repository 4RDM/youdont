import React, { FC, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";

// Assets
import { hasPermissions, isAdmin, UserContext } from "../../App";
import Container from "../../Components/ContainerComponent";
import LoginComponent from "../../Components/LoginComponent";
import "../Styles/DashboardIndex.scss";

interface UserStats {
	identifier?: string
	license?: string
	discord?: string
	deaths?: number
	heady?: number
	kills?: number
	kdr?: number
	playTime?: number
}

const Card: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
	return (
		<div className="card">
			{props.children}
		</div>
	);
};

const Dashboard: FC = () => {
	const session = useContext(UserContext);
	const [stats, setStats] = useState<UserStats>({});
	const [loading, setLoading] = useState(true);
	
	useEffect(() => {
		fetch("/api/dashboard/stats").then(x => x.json()).then(x => {
			// TODO: handle error
			if (x.code !== 200) return;
			const kdr = isNaN((x.kills || 0) / (x.deaths || 0)) ? 0 : (x.kills || 0) / (x.deaths || 0);
			setStats({ kdr, ...x });
			setLoading(false);
		});
	}, []);

	return session?.user == undefined ? <Container><LoginComponent /></Container> : (
		<Container>
			<div id="dashboard-container">
				<div id="dashboard-center-container">
					<div id="dashboard-header">
						<img src={`https://cdn.discordapp.com/avatars/${session?.user?.userid}/${session?.user?.avatar}.png?size=512`} alt="Awatar użytkownika" crossOrigin="anonymous" />
						<div id="dashboard-header-sub">
							<h1>Witaj {session?.user?.username}#{session?.user?.tag}</h1>
							<p>{session?.user?.userid}</p>
						</div>
					</div>
					<div id="dashboard-stats">
						{ isAdmin(session) &&
							<div id="dashboard-admin">
								<h1>Administracyjne</h1>
								<div className="content">
									{hasPermissions(session, "MANAGE_SHORTS") && <Link to="admin/shorts">Skracanie linków</Link>}
									{hasPermissions(session, "MANAGE_ARTICLES") && <Link to="admin/articles">Zarządzanie artykułami</Link>}
								</div>
							</div>
						}
						<div id="dashboard-ingame">
							<h1>Statystyki</h1>
							<div className="content">
								<Card className="dashboard-stat">
									<h1>Czas gry</h1>
									{ loading ? <PulseLoader color="white" size={15} /> : <p>{((stats.playTime || 0) / 60).toFixed(2)}h</p> }
								</Card>
								<Card className="dashboard-stat">
									<h1>Kills</h1>
									{ loading ? <PulseLoader color="white" size={15} /> : <p>{stats.kills}</p> }
								</Card>
								<Card className="dashboard-stat">
									<h1>Deaths</h1>
									{ loading ? <PulseLoader color="white" size={15} /> : <p>{stats.deaths}</p> }
								</Card>
								<Card className="dashboard-stat">
									<h1>K/D ratio</h1>
									{ loading ? <PulseLoader color="white" size={15} /> : <p>{stats.kdr?.toFixed(2)}</p> }
								</Card>
								<Card className="dashboard-stat">
									<h1>Headshots</h1>
									{ loading ? <PulseLoader color="white" size={15} /> : <p>{stats.heady}</p> }
								</Card>
								<Card className="dashboard-stat">
									<h1>Steam HEX</h1>
									{ loading ? <PulseLoader color="white" size={15} /> : <p>{stats.identifier}</p> }
								</Card>
								<Card className="dashboard-stat">
									<h1>Ranga</h1>
									{ loading ? <PulseLoader color="white" size={15} /> : <p>{session?.user?.role}</p> }
								</Card>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Container>
	);
};

export default Dashboard;