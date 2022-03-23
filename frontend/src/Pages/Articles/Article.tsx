import React, { FC, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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
	const { id } = useParams();

	useEffect(() => {
		fetch(`/api/articles/${id}`).then(x => x.json()).then(json => {
			if (json.code !== 200) return alert("BŁĄD");
			setArticle(json.article);
			setLoading(false);
		});
	}, []);

	useEffect(() => {
		if (article && content.current) {
			content.current.innerHTML = marked.marked(article.content).replace(/<img/, "<img crossorigin=\"anonymous\" ");
		}
	}, [isLoading, article, content]);

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
								<p id="article-publication-date">Data publikacji: {new Date(article.createDate).toLocaleDateString()}</p>
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