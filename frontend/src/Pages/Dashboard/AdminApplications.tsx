import React, { FC, useEffect, useState } from "react";

// Assets
import "../Styles/AdminApplications.scss";
import { Trash } from "@styled-icons/entypo/Trash";
import { Eye } from "@styled-icons/entypo/Eye";

interface Podanie {
	author: string
	approver: string
	approved: boolean
	date: Date
	active: boolean
	reason: string
	nick: string
	age: number
	voice: number
	long: string
	short: string
	steam: string
	docID?: string
}

const AdminApplications: FC = () => {
	const [Applications, setApplications] = useState<Podanie[]>([]);
	
	useEffect(() => {
		refetch();
	}, []);

	const refetch = () => fetch("/api/applications/applications").then(x => x.json()).then(res => {
		// TODO: handle error
		if (res.code !== 200) return;
		setApplications(res.data);
	});

	const remove = (docID: string) => {
		fetch(`/api/applications/application/${docID}`, {
			method: "DELETE"
		}).then((x) => x.json()).then(res => {
			// TODO: handle error
			if (res.code !== 200) return;
			refetch();
		});
	};

	const Card: FC<{ podanie: Podanie }> = (props) => {
		return (
			<div className="card">
				<h1>{props.podanie.nick}</h1>
				<div className="buttons">
					<button><Eye /></button>
					<button onClick={() => props.podanie.docID && remove(props.podanie.docID)}><Trash /></button>
				</div>
			</div>
		);
	};

	return (
		<div id="admin-applications">
			<div className="admin-application-cat">
				<h1>Podania do sprawdzenia</h1>
				{Applications.filter((a) => !a.approved).map((a) => <Card key={a.docID} podanie={a}></Card>)}
			</div>
			<div className="admin-application-cat">
				<h1>Podania sprawdzone</h1>
				{Applications.filter((a) => a.approved).map((a) => <Card key={a.docID} podanie={a}></Card>)}
			</div>
		</div>
	);
};

export default AdminApplications;