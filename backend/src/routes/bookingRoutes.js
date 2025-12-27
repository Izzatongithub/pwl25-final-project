import express from 'express'
import { 
  getFields, 
  getTimeSlots, 
  getBookings, 
  createBooking, 
  updateBookingStatus,
  getUserBooking,
  completeBooking 
} from '../controllers/bookingController.js'
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Daftar booking
router.get('/', verifyToken, getBookings)

// Buat booking baru
router.post('/', verifyToken, createBooking)

// Update status booking (admin)
router.put('/:id/status', verifyToken, isAdmin, updateBookingStatus)

// Ambil daftar lapangan
router.get('/fields', verifyToken, getFields)

// Ambil time slots tersedia
router.get('/time-slots', verifyToken, getTimeSlots)

// history booking
router.get('/user', verifyToken, getUserBooking)

router.put('/:id/complete', verifyToken, isAdmin, completeBooking)

export default router
