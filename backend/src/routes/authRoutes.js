import express from 'express'
import { register, login } from '../controllers/authController.js'
import { validate } from '../middlewares/validateMiddleware.js'

const router = express.Router()

router.post('/register', validate(['email', 'password']), register)
router.post('/login', validate(['email', 'password']), login)

export default router
