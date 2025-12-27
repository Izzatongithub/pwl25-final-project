<template>
  <div style="max-width:900px; margin:auto">
    <h1>Admin Panel</h1>
    <button @click="logout" style="margin-bottom:20px">Logout</button>

    <!-- section lapangan -->
    <section>
      <h2>Daftar Lapangan</h2>
      <table border="1" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Tipe</th>
            <th>Deskripsi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="field in fields" :key="field.id">
            <td>{{ field.name }}</td>
            <td>{{ field.type }}</td>
            <td>{{ field.deskripsi }}</td>
            <td>
              <button @click="editField(field)">Edit</button>
              <button @click="deleteField(field.id)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="addField" style="margin-top:10px">Tambah Lapangan</button>
    </section>

    <!-- Section Booking -->
    <section style="margin-top:30px">
      <h2>Daftar Booking</h2>
      <table border="1" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Lapangan</th>
            <th>Tanggal</th>
            <th>Jam</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in bookings" :key="booking.id">
            <td>{{ booking.user_name }}</td>
            <td>{{ booking.field_name }}</td>
            <td>{{ formatDate(booking.booking_date) }}</td>
            <td>{{ booking.start_time }} - {{ booking.end_time }}</td>
            <td>{{ bookingStatusLabel(booking.status) }}</td>
            <td>
              <button v-if="booking.status === 0"@click="completeBooking(booking)">Tandai Selesai</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Section Time Slots -->
    <section style="margin-top:30px">
      <h2>Daftar Time Slots</h2>
      <table border="1" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th>Lapangan</th>
            <th>Jam Mulai</th>
            <th>Jam Selesai</th>
            <th>Harga</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="slot in timeSlots" :key="slot.id">
            <td>{{ slot.field_name }}</td>
            <td>{{ slot.start_time }}</td>
            <td>{{ slot.end_time }}</td>
            <td>Rp {{ slot.price }}</td>
            <td>{{ slot.status === 1 ? 'Booked' : 'Tersedia' }}</td>
            <td>
              <button @click="editSlot(slot)">Edit</button>
              <button @click="deleteSlot(slot.id)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="addSlot" style="margin-top:10px">Tambah Time Slot</button>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const token = localStorage.getItem('token')

// state
const fields = ref([])
const bookings = ref([])
const timeSlots = ref([])

// fetch fields
async function loadFields() {
  const res = await fetch('http://localhost:3000/api/fields', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  fields.value = await res.json()
}

// fetch bookings
async function loadBookings() {
  const res = await fetch('http://localhost:3000/api/bookings', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  bookings.value = await res.json()
}

// tambah lapangan
async function addField() {
  const name = prompt('Nama Lapangan:')
  const type = prompt('Tipe Lapangan:')
  const deskripsi = prompt('Deskripsi Lapangan:')
  if (!name || !type || !deskripsi) return alert('Data tidak lengkap')

  const res = await fetch('http://localhost:3000/api/fields', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ name, type, deskripsi})
  })
  const data = await res.json()
  alert(data.message)
  loadFields()
}

// edit lapangan
async function editField(field) {
  const name = prompt('Nama Lapangan:', field.name) || field.name
  const type = prompt('Tipe Lapangan:', field.type) || field.type
  const price = parseInt(prompt('Harga:', field.price), 10) || field.price

  const res = await fetch(`http://localhost:3000/api/fields/${field.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ name, type, price })
  })
  const data = await res.json()
  alert(data.message)
  loadFields()
}

// hapus lapangan
async function deleteField(id) {
  if (!confirm('Hapus lapangan ini?')) return

  const res = await fetch(`http://localhost:3000/api/fields/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  })
  const data = await res.json()
  alert(data.message)
  loadFields()
}

async function completeBooking(booking) {
  if (!confirm('Tandai booking ini sebagai selesai?')) return

  const res = await fetch(`http://localhost:3000/api/bookings/${booking.id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ status: 1 }) // 1 = complete
  })

  const data = await res.json()
  alert(data.message)

  // reload booking & slot
  loadBookings()
  loadTimeSlots()
}


// fetch semua time slots
async function loadTimeSlots() {
  const res = await fetch('http://localhost:3000/api/time-slots', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  timeSlots.value = await res.json()
}

// tambah time slot
async function addSlot() {
    if (!fields.value.length) return alert('Tambahkan lapangan dulu!')

    const fieldId = parseInt(prompt('ID Lapangan:'), 10)
    const start = prompt('Jam Mulai (HH:MM):')
    const end = prompt('Jam Selesai (HH:MM):')
    const price = parseInt(prompt('Harga:'), 10)
    if (!fieldId || !start || !end || !price) return alert('Data tidak lengkap')

    const res = await fetch('http://localhost:3000/api/time-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ field_id: fieldId, start_time: start, end_time: end, price, status: 0 })
    })
    const data = await res.json()
    alert(data.message)
    loadTimeSlots()
}

// edit slot
async function editSlot(slot) {
  const start = prompt('Jam Mulai:', slot.start_time) || slot.start_time
  const end = prompt('Jam Selesai:', slot.end_time) || slot.end_time
  const price = parseInt(prompt('Harga:', slot.price), 10) || slot.price
  // const status = parseInt(prompt('Status (0=Tersedia,1=Booked):', slot.status), 10)

  const res = await fetch(`http://localhost:3000/api/time-slots/${slot.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ start_time: start, end_time: end, price, status })
  })
  const data = await res.json()
  alert(data.message)
  loadTimeSlots()
}

// hapus slot
async function deleteSlot(id) {
  if (!confirm('Hapus slot ini?')) return
  const res = await fetch(`http://localhost:3000/api/time-slots/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  })
  const data = await res.json()
  alert(data.message)
  loadTimeSlots()
}


// logout
function logout() {
  localStorage.removeItem('token')
  router.push('/')
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // bulan 0-11
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

function bookingStatusLabel(status) {
  if (status === 0) return 'Aktif'
  if (status === 1) return 'Selesai'
  return '-'
}

// load data awal
onMounted(() => {
    loadFields()
    loadBookings()
    loadTimeSlots()
})
</script>

<style scoped>
/* container utama */
div {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Judul halaman */
h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

/* Subjudul section */
section h2 {
  margin-bottom: 10px;
  color: #4caf50;
}

/* Tabel */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
  font-size: 14px;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f0f0f0;
}

/* Tombol */
button {
  padding: 6px 12px;
  margin: 5px 2px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

/* Tombol utama */
button:hover {
  opacity: 0.9;
}

/* Tombol aksi khusus */
button[disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Logout button */
button:first-of-type {
  background-color: #f44336; /* merah */
  color: white;
}

/* Tombol aksi lapangan dan slot */
button:not(:first-of-type) {
  background-color: #4caf50; /* hijau */
  color: white;
}

/* Section spacing */
section {
  margin-top: 30px;
}

/* Responsive: scroll horizontal untuk tabel kecil */
@media (max-width: 768px) {
  table {
    display: block;
    overflow-x: auto;
  }
}
</style>

