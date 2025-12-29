import { db } from '../config/database.js'

// GET /api/fields
export async function getFields(req, res) {
  try {
    const [rows] = await db.query(`SELECT id, name, type FROM fields`)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server' })
  }
}

// GET /api/time-slots
export async function getTimeSlots(req, res) {
  const { field_id, date } = req.query

  try {
    // ambil semua time slots
    const [slots] = await db.query(
        'SELECT * FROM time_slots WHERE field_id = ?',
        [req.query.field_id]
    )

    // ambil booking yang sudah close di tanggal & lapangan tersebut
    const [booked] = await db.query(
      `SELECT time_slot_id FROM bookings WHERE field_id=? AND booking_date=? AND status=0`,
      [field_id, date]
    )

    const bookedIds = booked.map(b => b.time_slot_id)

    // tandai available slot
    const availableSlots = slots.map(slot => ({
      ...slot,
      available: !bookedIds.includes(slot.id)
    }))

    res.json(availableSlots)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server' })
  }
}

// Ambil semua booking dengan jam dari time_slots
export async function getBookings(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT 
      b.id,
      u.name AS user_name, 
      f.name AS field_name,  
      b.booking_date, 
      ts.start_time,
      ts.end_time,
      b.status
      FROM bookings b
      JOIN fields f ON b.field_id = f.id
      JOIN time_slots ts ON b.time_slot_id = ts.id
      JOIN users u ON b.user_id = u.id
      ORDER BY b.booking_date, ts.start_time;
    `)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server' })
  }
}

export async function createBooking(req, res) {
  const { field_id, booking_date, time_slot_id } = req.body
  const user_id = req.user.id

  try {
    // Ambil harga dari time_slot
    const [slots] = await db.query(
      'SELECT price FROM time_slots WHERE id = ?',
      [time_slot_id]
    )
    if (slots.length === 0) return res.status(404).json({ message: 'Time slot tidak ditemukan' })

    const total_price = slots[0].price

    // Insert booking (pakai booking_date sesuai validator / frontend)
    await db.query(
      'INSERT INTO bookings (user_id, field_id, time_slot_id, booking_date, total_price, status) VALUES (?, ?, ?, ?, ?, 0)',
      [user_id, field_id, time_slot_id, booking_date, total_price]
    )

    // Update status slot
    await db.query('UPDATE time_slots SET status = 1 WHERE id = ?', [time_slot_id])

    res.json({ message: 'Booking berhasil', total_price })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Ambil riwayat booking user yang login
export async function getUserBooking(req, res) {
  try {
    const userId = req.user.id // dari verifyToken middleware
    const [rows] = await db.query(
      `SELECT b.id, f.name AS field_name, ts.start_time, ts.end_time, b.booking_date, b.status, b.total_price
       FROM bookings b
       JOIN fields f ON b.field_id = f.id
       JOIN time_slots ts ON b.time_slot_id = ts.id
       WHERE b.user_id = ?`,
      [userId]
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Gagal mengambil riwayat booking' })
  }
}

// update booking status oleh admin
export async function updateBookingStatus(req, res) {
  const { id } = req.params
  const { status } = req.body
  // status: 0=booked, 1=selesai

  try {
    const [rows] = await db.query(
      'SELECT time_slot_id, status FROM bookings WHERE id = ?',
      [id]
    )

    if (rows.length === 0)
      return res.status(404).json({ message: 'Booking tidak ditemukan' })

    const booking = rows[0]

    // tidak boleh update kalau sudah selesai/batal
    if (booking.status !== 0) {
      return res.status(400).json({ message: 'Booking sudah tidak aktif' })
    }

    // update booking
    await db.query(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, id]
    )

    // kalau selesai / batal → buka slot
    if (status === 1) {
      await db.query(
        'UPDATE time_slots SET status = 0 WHERE id = ?',
        [booking.time_slot_id]
      )
    }

    res.json({ message: 'Status booking berhasil diperbarui' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// COMPLETE BOOKING (Admin)
export async function completeBooking(req, res) {
  const { id } = req.params

  try {
    // ambil booking
    const [rows] = await db.query(
      'SELECT time_slot_id FROM bookings WHERE id = ?',
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking tidak ditemukan' })
    }

    const time_slot_id = rows[0].time_slot_id

    // update booking jadi complete (1)
    await db.query(
      'UPDATE bookings SET status = 1 WHERE id = ?',
      [id]
    )

    // buka kembali slot
    await db.query(
      'UPDATE time_slots SET status = 0 WHERE id = ?',
      [time_slot_id]
    )

    res.json({ message: 'Booking selesai & slot dibuka kembali' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
