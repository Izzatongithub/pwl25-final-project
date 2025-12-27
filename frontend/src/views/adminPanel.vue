<template>
  <div style="max-width:900px; margin:auto">
    <h1>Admin Panel</h1>
    <button @click="logout" style="margin-bottom:20px">Logout</button>

    <!-- Section Lapangan -->
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
            <th>Lapangan</th>
            <th>Tanggal</th>
            <th>Jam</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in bookings" :key="booking.id">
            <td>{{ booking.field_name }}</td>
            <td>{{ formatDate(booking.booking_date) }}</td>
            <td>{{ booking.start_time }} - {{ booking.end_time }}</td>
            <td>{{ booking.status === 1 ? 'Booked' : 'Available' }}</td>
            <td>
              <!-- <button v-if="booking.status==='close'" @click="updateBookingStatus(booking.id,'open')">Open</button>
              <button v-else @click="updateBookingStatus(booking.id,'close')">Close</button> -->
                <button v-if="booking.status === 1" @click="cancelBooking(booking.id)">Batalkan Booking</button>
                <button v-else disabled>Tersedia</button>
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
import { apiFetch } from '../api.js'

const router = useRouter()

// state
const fields = ref([])
const bookings = ref([])
const timeSlots = ref([])

// fetch fields
async function loadFields() {
  fields.value = await apiFetch('/api/fields')
}

// fetch bookings
async function loadBookings() {
  bookings.value = await apiFetch('/api/bookings')
}

// tambah lapangan
async function addField() {
  const name = prompt('Nama Lapangan:')
  const type = prompt('Tipe Lapangan:')
  const deskripsi = prompt('Deskripsi Lapangan:')
  if (!name || !type || !deskripsi) return alert('Data tidak lengkap')

  try {
    const data = await apiFetch('/api/fields', {
      method: 'POST',
      body: { name, type, deskripsi },
    })
    alert(data.message)
  } catch (err) {
    alert(err?.message || 'Gagal menambah lapangan')
  }
  loadFields()
}

// edit lapangan
async function editField(field) {
  const name = prompt('Nama Lapangan:', field.name) || field.name
  const type = prompt('Tipe Lapangan:', field.type) || field.type
  const deskripsi = prompt('Deskripsi Lapangan:', field.deskripsi) || field.deskripsi

  try {
    const data = await apiFetch(`/api/fields/${field.id}`, {
      method: 'PUT',
      body: { name, type, deskripsi },
    })
    alert(data.message)
  } catch (err) {
    alert(err?.message || 'Gagal update lapangan')
  }
  loadFields()
}

// hapus lapangan
async function deleteField(id) {
  if (!confirm('Hapus lapangan ini?')) return

  try {
    const data = await apiFetch(`/api/fields/${id}`, {
      method: 'DELETE',
    })
    alert(data.message)
  } catch (err) {
    alert(err?.message || 'Gagal hapus lapangan')
  }
  loadFields()
}

// update status booking
async function updateBookingStatus(id, status) {
  try {
    const data = await apiFetch(`/api/bookings/${id}/status`, {
      method: 'PUT',
      body: { status },
    })
    alert(data.message)
  } catch (err) {
    alert(err?.message || 'Gagal update booking')
  }
  loadBookings()
}

async function cancelBooking(id) {
  try {
    await apiFetch(`/api/bookings/${id}/status`, {
      method: 'PUT',
      body: { status: 0 },
    })
  } catch (err) {
    alert(err?.message || 'Gagal membatalkan booking')
  }
  // reload daftar booking
  loadBookings()
}

// fetch semua time slots
async function loadTimeSlots() {
  timeSlots.value = await apiFetch('/api/time-slots')
}

// tambah time slot
async function addSlot() {
    if (!fields.value.length) return alert('Tambahkan lapangan dulu!')

    const fieldId = parseInt(prompt('ID Lapangan:'), 10)
    const start = prompt('Jam Mulai (HH:MM):')
    const end = prompt('Jam Selesai (HH:MM):')
    const price = parseInt(prompt('Harga:'), 10)
    if (!fieldId || !start || !end || !price) return alert('Data tidak lengkap')

    try {
      const data = await apiFetch('/api/time-slots', {
        method: 'POST',
        body: { field_id: fieldId, start_time: start, end_time: end, price },
      })
      alert(data.message)
    } catch (err) {
      alert(err?.message || 'Gagal tambah slot')
    }
    loadTimeSlots()
}

// edit slot
async function editSlot(slot) {
  const start = prompt('Jam Mulai:', slot.start_time) || slot.start_time
  const end = prompt('Jam Selesai:', slot.end_time) || slot.end_time
  const price = parseInt(prompt('Harga:', slot.price), 10) || slot.price
  const status = parseInt(prompt('Status (0=Tersedia,1=Booked):', slot.status), 10)

  try {
    const data = await apiFetch(`/api/time-slots/${slot.id}`, {
      method: 'PUT',
      body: { start_time: start, end_time: end, price, status },
    })
    alert(data.message)
  } catch (err) {
    alert(err?.message || 'Gagal update slot')
  }
  loadTimeSlots()
}

// hapus slot
async function deleteSlot(id) {
  if (!confirm('Hapus slot ini?')) return
  try {
    const data = await apiFetch(`/api/time-slots/${id}`, {
      method: 'DELETE',
    })
    alert(data.message)
  } catch (err) {
    alert(err?.message || 'Gagal hapus slot')
  }
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

// load data awal
onMounted(() => {
    loadFields()
    loadBookings()
    loadTimeSlots()
})
</script>

<style scoped>
/* Container utama */
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

