import React, { FC, useEffect, useState } from "react";

// Assets
import Loading from "../Components/LoadingComponent";
import Container from "../Components/ContainerComponent";
import "./Styles/Administration.scss";

interface Roles {
	[index: string]: [
		{
			nickname: string
			avatar: string
			id: string
		}?
	]
}

const Administration: FC = () => {
	const [roles, setRoles] = useState<Roles>({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/dashboard/admins")
			.then((x) => x.json())
			.then((x) => {
				if (x.code == 401) return;
				setRoles(x.admins.roles);
				setLoading(false);
			});
	}, []);

	return (
		<Container>
			{
				loading ? (<Loading />) : (
					<div id="administration-container">
						{
							Object.keys(roles).map((role) => {
								return (
									<div className="administration-column" key={role}>
										<h1>{role}</h1>
										<div className="administration-row" key={role}>
											{roles[role].map((admin) => <div key={admin?.id} className="card"><h1>{admin?.nickname}</h1><img crossOrigin="anonymous" src={admin?.avatar} width="100%" alt="avatar" /></div>)}
										</div>
									</div>
								);
							})
						}
					</div>
				)
			}
		</Container>
	);
};

export default Administration;