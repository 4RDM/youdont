import { Router } from 'express'
const router = Router()

/*
	* /api/docs/doc/1234
	! Pobiera podanie o :ID
*/
router.get('/doc/:id', (req, res) => {})

/*
	* /api/docs/doc/1234
	! Usuwa podanie o :ID
*/
router.delete('/doc/:id', (req, res) => {})

/*
	* /api/docs/doc/1234/accept
	! Akceptuje podanie o :ID
*/
router.post('/doc/:id/accept', (req, res) => {})

/*
	* /api/docs/doc/1234/reject
	! Odrzuca podanie o :ID

	?{
	?	reason: string
	?}
*/
router.post('/doc/:id/reject', (req, res) => {})

/*
	* /api/docs/publish
	! Publikuje wyniki
*/
router.get('/publish')

/*
	* /api/docs/upload
	! Złóż podanie do sprawdzenia

	?{
	?	userTag: string
	?	userID: string
	?	userSteam: string
	?	userAge: int
	?	shortDescription: string
	?	longDescription: string
	?}
*/
router.put('/upload', (req, res) => {})

export default router
