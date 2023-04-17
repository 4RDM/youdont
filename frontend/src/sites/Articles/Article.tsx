import React, { FC, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as marked from 'marked'

import './Article.scss'
import Loading from '../../compontents/Loading/Loading'
import NotFound from '../NotFound/NotFound'

export interface Article {
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

export default () => {
	const [isLoading, setLoading] = useState(true)
	const [article, setArticle] = useState<Article | null>(null)
	const content = useRef<HTMLDivElement>(null)
	const { id } = useParams()

	const [title, setTitle] = useState('Artykuł')

	useEffect(() => {
		document.title = title
	}, [title])

	useEffect(() => {
		fetch(`/api/articles/${id}`)
			.then((x) => x.json())
			.then((json) => {
				// TODO: handle error
				if (json.code !== 200) return alert('BŁĄD')
				setArticle(json.article)
				setLoading(false)

				setTitle(json.article.title)
			})
			.catch((err) => {
				console.error(err)
				alert('BŁĄD')
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
		<div id="article-container">
			<div id="article-header">
				<h1>{article.title}</h1>
				<div id="article-sub-header">
					<div id="article-author">
						<img
							src={article.author.avatar}
							alt="Awatar autora"
							crossOrigin="anonymous"
						/>
						<p>{article.author.nickname},</p>
					</div>
					<p id="article-publication-date">
						Data publikacji:{' '}
						{new Date(article.createDate).toLocaleDateString()}
					</p>
				</div>
			</div>
			<div id="article-content" ref={content}></div>
		</div>
	) : (
		<NotFound />
	)
}
