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
						<img src={props.article.author.avatar} alt="Awatar autora" />
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

	const temp: Article[] = [];
	for (let i = 0; i < 20; i++) temp.push({
		title: "Wpłata na serwer",
		description: "Krótki artykuł wyjaśniający wszystko co musisz wiedzieć przed/po wpłaceniu dotacji na serwer.",
		background: "https://4rdm.pl/content/images/2021/08/donateuwaga.png",
		id: "1234",
		author: {
			nickname: "Kubamaz",
			avatar: "https://cdn.discordapp.com/avatars/594526434526101527/a_c1af0e5c48ff435a49da731b412d0c63.webp?size=96"
		},
		tags: ["donate", "4rdm", "rdm", "paypal", "psc", "blik"],
		views: 100,
		createDate: new Date(),
	});

	useEffect(() => {
		setArticles(temp);
	}, []);

	setTimeout(() => setLoading(false), 200);

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