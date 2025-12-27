import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import fieldRoutes from './routes/fieldRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import timeSlotRoutes from './routes/timeSlotRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

//endpoint
app.use('/api/auth', authRoutes)
app.use('/api/fields', fieldRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/time-slots', timeSlotRoutes)

app.get('/api/test', (req, res) => {
  res.json({ message: 'API berjalan' })
})

export default app
