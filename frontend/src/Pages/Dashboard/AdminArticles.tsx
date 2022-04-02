import React, { FC, useEffect, useRef, useState } from "react";
import { PulseLoader } from "react-spinners";
import { Article } from "../Articles/Article";
import * as marked from "marked";

// Assets
import { Cross } from "@styled-icons/entypo/Cross";
import "../Styles/AdminArticles.scss";

const AdminArticles: FC = () => {
	const [articles, setArticles] = useState<Article[]>([]);
	const [article, setArticle] = useState<Article | null>(null);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);

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

	const Editor: FC = (props) => {
		const [title, setTitle] = useState(article?.title);
		const [description, setDescription] = useState(article?.description);
		const [content, setContent] = useState(article?.content);
		const [id, setID] = useState(article?.id);

		useEffect(() => {
			window.onbeforeunload = open ? function() {
				return false;
			} : null;
		}, [open]);

		const apply = () => {
			fetch("/api/articles/update", {
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title, description, content, id, originalID: article?.id || ""
				}),
				method: "POST",
			}).then(x => x.json()).then(json => {
				// TODO: handle error
				if (json.code !== 200) return alert("BŁĄD");
				setOpen(false);
				setArticle(null);
				refetch();
			});
		};

		return (
			<div id="admin-articles-editor" style={{ "display": (article == null || open == false) ? "none" : "block" }}>
				<div className="article-container">
					<button className="close-button" onClick={() => setOpen(!open)}><Cross /></button>
					<div className="row2">
						<div className="column">
							<p>Tytuł</p>
							<textarea value={title} onChange={(ev) => setTitle(ev.target.value)}></textarea>
						</div>
						<div className="column">
							<p>Opis</p>
							<textarea value={description} onChange={(ev) => setDescription(ev.target.value)}></textarea>
						</div>
						<div className="column">
							<p>ID artykułu</p>
							<textarea value={id} onChange={(ev) => setID(ev.target.value)}></textarea>
						</div>
					</div>
					<div className="row">
						<div className="column">
							<p>Zawartość</p>
							<textarea className="content" onChange={(ev) => setContent(ev.target.value)} value={content}></textarea>
						</div>
						<div className="column">
							<p>Podgląd</p>
							<div className="preview" dangerouslySetInnerHTML={{ __html: marked.marked(content || "") }}></div>
						</div>
					</div>
					<button className="apply-button" onClick={apply}>Zastosuj zmiany</button>
				</div>
			</div>
		);
	};

	const Card: FC<{ article: Article }> = (props) => {
		return (
			<div className="card" onClick={() => {
				setOpen(!open);
				setArticle(props.article);
			}}>
				<h1>{props.article.title}</h1>
				<div className="card-author">
					<img src={props.article.author.avatar} crossOrigin="anonymous" />
					<p>{props.article.author.nickname}</p>
				</div>
			</div>
		);
	};

	return (
		<>
			<Editor />
			<div id="admin-articles">
				<h1>Artykuły</h1>
				<div id="admin-articles-articles">
					{loading && <div id="admin-loading"><PulseLoader size={20} color={"white"} /></div>}
					{articles.map((article) => <Card key={article.title} article={article} />)}
				</div>
			</div>
		</>
	);
};

export default AdminArticles;