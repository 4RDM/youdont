import React, { FC, useEffect, useRef, useState } from "react";
import * as marked from "marked";

// Assets
import LoadingComponent from "../../Components/LoadingComponent";
import "../Styles/Article.scss";

interface Article {
	title: string
	content: string
	author: {
		nickname: string
		avatar: string
	}
	tags: string[]
	views: number
	createDate: Date
}


const Article: FC = () => {
	const [isLoading, setLoading] = useState(true);
	const [article, setArticle] = useState<Article | null>(null);
	const content = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setArticle({
			title: "Wpłata na serwer",
			content: "# Witaj świecie!\n\nCześć co u ciebie?\n\n![Lorem ipsum](https://4rdm.pl/public/assets/logo.png)",
			author: {
				nickname: "Kubamaz",
				avatar: "https://cdn.discordapp.com/avatars/594526434526101527/a_c1af0e5c48ff435a49da731b412d0c63.webp?size=96"
			},
			tags: ["donate", "4rdm", "rdm", "paypal", "psc", "blik"],
			views: 100,
			createDate: new Date(),
		});
	}, []);

	useEffect(() => {
		if (article && content.current) {
			content.current.innerHTML = marked.marked(article.content);
		}
	}, [isLoading, article, content]);

	setTimeout(() => setLoading(false), 1000);

	return (
		<>
			{(isLoading || !article) ? (<LoadingComponent />) :
				(
					<div id="article-container">
						<div id="article-header">
							<h1>{article.title}</h1>
							<div id="article-sub-header">
								<div id="article-author">
									<img src={article.author.avatar} alt="Awatar autora" crossOrigin="anonymous" />
									<p>{article.author.nickname},</p>
								</div>
								<p id="article-publication-date">Data publikacji: {article.createDate.toLocaleDateString()}, wyświetlenia: {article.views}</p>
							</div>
						</div>
						<div id="article-content" ref={content}></div>
					</div>
				)
			}
		</>
	);
};

export default Article;