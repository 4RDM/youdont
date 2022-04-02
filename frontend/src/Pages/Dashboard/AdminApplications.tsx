import React, { FC, useEffect, useState } from "react";

// Assets
import "../Styles/AdminApplications.scss";
import { Trash } from "@styled-icons/entypo/Trash";
import { Eye } from "@styled-icons/entypo/Eye";
import { ArrowWithCircleRight } from "@styled-icons/entypo/ArrowWithCircleRight";

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
	const [podanie, setPodanie] = useState<Podanie | null>(null);
	const [open, setOpen] = useState(false);
	
	useEffect(() => {
		refetch();
	}, []);

	const refetch = () => fetch("/api/applications/applications").then(x => x.json()).then(res => {
		// TODO: handle error
		if (res.code !== 200) return;
		setApplications(res.data);
	});

	const removeApplication = (docID: string) => {
		fetch(`/api/applications/application/${docID}`, {
			method: "DELETE"
		}).then((x) => x.json()).then(res => {
			// TODO: handle error
			if (res.code !== 200) return;
			refetch();
		});
	};

	const openApplication = (docID: Podanie) => {
		setPodanie(podanie);
		setOpen(true);
	};

	const accept = (docID: string) => {
		fetch(`/api/applications/application/${docID}/accept`, {
			method: "POST"
		}).then((x) => x.json()).then(res => {
			// TODO: handle error
			if (res.code !== 200) return;
			refetch();
		});
	};

	const reject = (docID: string, reason: string) => {
		fetch(`/api/applications/application/${docID}/reject`, {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({ reason }),
		}).then((x) => x.json()).then(res => {
			// TODO: handle error
			if (res.code !== 200) return;
			refetch();
		});
	};

	const revert = (docID: string) => {
		fetch(`/api/applications/application/${docID}/revert`).then((x) => x.json()).then(res => {
			// TODO: handle error
			if (res.code !== 200) return;
			refetch();
		});
	};

	const publish = () => {
		fetch("/api/applications/publish").then((x) => x.json()).then(res => {
			// TODO: handle error
			if (res.code !== 200) return;
			refetch();
		});
	};

	const Card: FC<{ podanie: Podanie, sprawdzone: boolean }> = (props) => {
		return (
			<div className="card">
				<h1>{props.podanie.nick}</h1>
				<div className="buttons">
					<button onClick={() => props.podanie.docID && openApplication(props.podanie)}><Eye /></button>
					{props.sprawdzone
						? <button onClick={() => props.podanie.docID && removeApplication(props.podanie.docID)}><Trash /></button>
						: <button onClick={() => props.podanie.docID && revert(props.podanie.docID)}><ArrowWithCircleRight /></button>
					}
				</div>
			</div>
		);
	};

	return (
		<div id="admin-applications">
			<div className="admin-application-cat">
				<h1>Podania do sprawdzenia</h1>
				{Applications.filter((a) => !a.approved).length == 0 && <p>Nie ma nic do wyświetlenia</p>}
				{Applications.filter((a) => !a.approved).map((a) => <Card key={a.docID} podanie={a} sprawdzone={false}></Card>)}
			</div>
			<div className="admin-application-cat">
				<h1>Podania sprawdzone</h1>
				{Applications.filter((a) => a.approved).length == 0 && <p>Nie ma nic do wyświetlenia</p>}
				{Applications.filter((a) => a.approved).map((a) => <Card key={a.docID} podanie={a} sprawdzone={true}></Card>)}
			</div>
		</div>
	);
};

export default AdminApplications;