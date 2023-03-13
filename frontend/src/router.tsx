import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import Articles from './sites/Articles/Articles'
import Home from './sites/Home/Home'

export const BrowserRouter = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/articles',
		element: <Articles />,
	},
])
