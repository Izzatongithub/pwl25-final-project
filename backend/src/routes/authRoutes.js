import express from 'express'
import { register, login } from '../controllers/authController.js'
import { validate } from '../middlewares/validateMiddleware.js'

const router = express.Router()

router.post('/register', validate(['username', 'password']), register)
router.post('/login', validate(['username', 'password']), login)

export default router
