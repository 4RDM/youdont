import { Router, json, urlencoded } from 'express'

import docsRouter from './routes/docs.route'
import dashboardRouter from './routes/dashboard.route'

const router = Router()

router.use(json())
router.use(urlencoded({ extended: true }))
router.use('/docs', docsRouter)
router.use('/dashboard', dashboardRouter)

router.get('/*', (req, res) =>
	res
		.status(404)
		.json({ code: 404, message: `Unknown endpoint: ${req.path}` })
)

export default router
