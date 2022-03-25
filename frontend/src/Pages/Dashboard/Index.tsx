import React, { FC, useContext, useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";

// Assets
import { UserContext } from "../../App";
import Loading from "../../Components/LoadingComponent";
import "../Styles/DashboardIndex.scss";

interface Application {
	author: string
	date: number
	reason: string
	approved: boolean
	active: boolean
	_id: string
	approver: string
}

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
	const [applications, setApplications] = useState<Application[]>([]);
	const [stats, setStats] = useState<UserStats>({});
	const [loading, setLoading] = useState(true);
	const [applicationsLoading, setApplicationsLoading] = useState(true);
	
	useEffect(() => {
		fetch("/api/dashboard/stats").then(x => x.json()).then(x => {
			// TODO: handle error
			if (x.code !== 200) return;
			const kdr = isNaN((x.kills || 0) / (x.deaths || 0)) ? 0 : (x.kills || 0) / (x.deaths || 0);
			setStats({ kdr, ...x });
			setLoading(false);
		});
		fetch("/api/applications/user/all").then(x => x.json()).then(x => {
			// TODO: handle error
			if (x.code !== 200) return;
			setApplications(x.data);
			setApplicationsLoading(false);
		});
	}, []);

	return loading ? <Loading /> : (
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
					<div id="dashboard-admin">
						<h1>Administracyjne</h1>
						<div className="content">
							{true && <button>Sprawdzanie podań</button>}
							{true && <button>Skracanie linków</button>}
							{true && <button>Współdzielenie plików</button>}
							{true && <button>Statystyki</button>}
							{true && <button>Zarządzanie artykułami</button>}
						</div>
					</div>
					<div id="dashboard-ingame">
						<h1>Statystyki</h1>
						<div className="content">
							<Card className="dashboard-stat">
								<h1>Czas gry</h1>
								<p>{((stats.playTime || 0) / 60).toFixed(2)}h</p>
							</Card>
							<Card className="dashboard-stat">
								<h1>Kills</h1>
								<p>{stats.kills}</p>
							</Card>
							<Card className="dashboard-stat">
								<h1>Deaths</h1>
								<p>{stats.deaths}</p>
							</Card>
							<Card className="dashboard-stat">
								<h1>K/D ratio</h1>
								<p>{stats.kdr?.toFixed(2)}</p>
							</Card>
							<Card className="dashboard-stat">
								<h1>Headshots</h1>
								<p>{stats.heady}</p>
							</Card>
							<Card className="dashboard-stat">
								<h1>Steam HEX</h1>
								<p>{stats.identifier}</p>
							</Card>
							<Card className="dashboard-stat">
								<h1>Ranga</h1>
								<p>{session?.user?.role}</p>
							</Card>
						</div>
					</div>
					<div id="dashboard-applications">
						<h1>Podania</h1>
						{applicationsLoading && <PulseLoader size={35} color={"white"} />}
						<div className="content">
							{applications.map((podanie) => <Card key={podanie._id} className="dashboard-application">
								<h1>#{podanie._id.substring(0, 7)}</h1>
							</Card>)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;