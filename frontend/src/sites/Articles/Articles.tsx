import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye } from '@styled-icons/entypo'

import './Articles.scss'
import Loading from '../../compontents/Loading/Loading'
import useDocumentTitle from '../../hooks/useDocumentTitle'

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

export default () => {
	const [isLoading, setLoading] = useState(true)
	const [articles, setArticles] = useState<Article[]>([])

	useDocumentTitle('Artykuły')

	useEffect(() => {
		fetch('/api/articles')
			.then((x) => x.json())
			.then((json) => {
				if (json.code !== 200) return alert('BŁĄD')

				setArticles(json.articles)

				setLoading(false)
			})
			.catch((err) => {
				console.error(err)
				alert('BŁĄD')
			})
	}, [])

	return isLoading ? (
		<Loading />
	) : (
		<div id="articles-container">
			<h1>Artykuły</h1>
			<div id="articles-list">
				{articles.map((article, i) => (
					<Link to={article.id} key={i}>
						<div
							className="article-card"
							style={{
								backgroundImage: article.background || 'none',
							}}
						>
							<h1 className="article-card-header">
								{article.title}
							</h1>
							<p className="article-card-description">
								{article.description}
							</p>
							<div className="article-card-sub">
								<div className="article-card-author">
									<img
										src={article.author.avatar}
										alt="Awatar autora"
										crossOrigin="anonymous"
									/>
									<p className="article-author">
										{article.author.nickname}
									</p>
								</div>
								<p className="article-views">
									<Eye size={15} /> {article.views}
								</p>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}
