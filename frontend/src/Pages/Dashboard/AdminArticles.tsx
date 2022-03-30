import React, { FC, useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { Article } from "../Articles/Article";

// Assets
import "../Styles/AdminArticles.scss";

const AdminArticles: FC = () => {
	const [articles, setArticles] = useState<Article[]>([]);
	const [loading, setLoading] = useState(true);

	const refetch = () =>
		fetch("/api/articles").then(x => x.json()).then(json => {
			// TODO: handle error
			if (json.code !== 200) return alert("BŁĄD");
			setArticles(json.articles);
			setLoading(false);
		});

	useEffect(() => {
		refetch();
	}, []);

	const Card: FC<{ article: Article }> = (props) => {
		return (
			<div className="card">
				<h1>{props.article.title}</h1>
				<div className="card-author">
					<img src={props.article.author.avatar} crossOrigin="anonymous" />
					<p>{props.article.author.nickname}</p>
				</div>
			</div>
		);
	};

	return (
		<div id="admin-articles">
			<h1>Artykuły</h1>
			<div id="admin-articles-articles">
				{loading && <div id="admin-loading"><PulseLoader size={20} color={"white"} /></div>}
				{articles.map((article) => <Card key={article.title} article={article} />)}
			</div>
		</div>
	);
};

export default AdminArticles;