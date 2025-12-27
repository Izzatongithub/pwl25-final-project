import db from '../config/database.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// register
export async function register(req, res) {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Data tidak lengkap' })
  }

  const [existing] = await db.query(
    'SELECT id FROM users WHERE email = ?',
    [email]
  )

  if (existing.length > 0) {
    return res.status(400).json({ message: 'Email sudah terdaftar' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  )

  res.json({ message: 'Register berhasil' })
}

// login
export async function login(req, res) {
  const { email, password } = req.body

  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  )

  if (rows.length === 0) {
    return res.status(401).json({ message: 'Email tidak ditemukan' })
  }

  const user = rows[0]

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return res.status(401).json({ message: 'Password salah' })
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )

  res.json({ token })
}
