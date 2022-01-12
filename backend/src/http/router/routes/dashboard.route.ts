import { NextFunction, Request, Response, Router } from 'express'
const router = Router()

router.get('/login', (req, res) => {})
// prettier-ignore
router.get('/logout', (req, res) => req.session.destroy(() => res.redirect('/')))
router.get('/session', (req, res) => {})

export default router
