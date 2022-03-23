import { Eye } from "@styled-icons/entypo";
import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Assets
import LoadingComponent from "../../Components/LoadingComponent";
import "../Styles/Articles.scss";

interface Article {
	title: string
	description: string
	id: string
	background?: string
	author: {
		nickname: string
		avatar: string
	}
	tags: string[]
	views: number
	createDate: Date
}

const ArticleCard: FC<{ article: Article }> = (props) => {
	return (
		<Link to={props.article.id}>
			<div className="article-card" style={{backgroundImage: props.article.background || "none"}}>
				<h1 className="article-card-header">{props.article.title}</h1>
				<p className="article-card-description">{props.article.description}</p>
				<div className="article-card-sub">
					<div className="article-card-author">
						<img src={props.article.author.avatar} alt="Awatar autora" crossOrigin="anonymous" />
						<p className="article-author">{props.article.author.nickname}</p>
					</div>
					<p className="article-views"><Eye size={15} /> {props.article.views}</p>
				</div>
			</div>
		</Link>
	);
};

const Articles: FC = () => {
	const [isLoading, setLoading] = useState(true);
	const [articles, setArticles] = useState<Article[]>([]);

	useEffect(() => {
		fetch("/api/articles").then(x => x.json()).then(json => {
			if (json.code !== 200) return alert("BŁĄD");
			setArticles(json.articles);
			setLoading(false);
		});
	}, []);

	return (
		<>
			{isLoading ? (<LoadingComponent />) :
				(
					<div id="articles-container">
						{articles.map((article, i) => (
							<ArticleCard key={i} article={article} />
						))}
					</div>
				)
			}
		</>
	);
};

export default Articles;