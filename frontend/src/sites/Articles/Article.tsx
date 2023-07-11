import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as marked from 'marked'
import { Helmet } from 'react-helmet'

import { Article } from './Articles'

import './Article.scss'
import Loading from '../../compontents/Loading/Loading'
import NotFound from '../NotFound/NotFound'

export default () => {
	const [isLoading, setLoading] = useState(true)
	const [article, setArticle] = useState<Article | null>(null)
	const [error, setError] = useState(false)
	const content = useRef<HTMLDivElement>(null)
	const { id } = useParams()

	useEffect(() => {
		fetch(`/api/articles/${id}`)
			.then((x) => x.json())
			.then((json) => {
				// TODO: handle error
				if (json.code !== 200) {
					setError(true)
					setLoading(false)
					return
				}

				setArticle(json.article)

				setLoading(false)
			})
			.catch((err) => {
				console.error(err)
				setError(true)
			})
	}, [])

	useEffect(() => {
		if (article && content.current) {
			content.current.innerHTML = marked
				.marked(article.content)
				.replace(/<img/, '<img crossorigin="anonymous" ')
		}
	}, [isLoading, article, content])

	return isLoading ? (
		<Loading />
	) : article ? (
		!error ? (
			<article>
				<Helmet>
					<title>{article.title}</title>
					<meta
						name="description"
						content={article.articleDescription}
					/>
					<meta name="author" content={article.discordName} />
					<meta name="twitter:card" content="summary" />
					<meta name="twitter:title" content="Artykuł" />
					<meta
						name="twitter:description"
						content={article.articleDescription}
					/>
				</Helmet>
				<div id="article-container">
					<header>
						<div id="article-header">
							<h1>{article.title}</h1>
							<div id="article-sub-header">
								<div id="article-author">
									<img
										src={article.discordAvatar}
										alt="Awatar autora"
										crossOrigin="anonymous"
									/>
									<p>{article.discordName},</p>
								</div>
								<p id="article-publication-date">
									Data publikacji:{' '}
									{new Date(
										article.createdAt
									).toLocaleDateString()}
								</p>
							</div>
						</div>
					</header>
					<div id="article-content" ref={content}></div>
				</div>
			</article>
		) : (
			<NotFound />
		)
	) : (
		<NotFound />
	)
}
