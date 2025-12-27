<template>
  <div class="container">
    <h2>Riwayat Booking</h2>

    <!-- Button kembali ke dashboard -->
    <button class="btn-back" @click="goBack">Kembali ke Dashboard</button>

    <div v-if="message" class="message-error">{{ message }}</div>

    <table v-if="bookings.length" class="booking-table">
      <thead>
        <tr>
          <th>No</th>
          <th>Lapangan</th>
          <th>Tanggal</th>
          <th>Jam</th>
          <th>Status</th>
          <th>Total Harga</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(b, index) in bookings" :key="b.id">
          <td>{{ index + 1 }}</td>
          <td>{{ b.field_name }}</td>
          <td>{{ formatDate(b.booking_date) }}</td>
          <td>{{ b.start_time }} - {{ b.end_time }}</td>
          <td>{{ bookingStatusLabel(b.status) }}</td>
          <td>{{ b.total_price }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else class="no-data">Belum ada riwayat booking.</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const bookings = ref([])
const message = ref('')
const router = useRouter()

function goBack() {
  router.push('/dashboard')
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

async function loadBookingHistory() {
  try {
    const res = await fetch('http://localhost:3000/api/bookings/user', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
    if (!res.ok) throw new Error('Gagal mengambil data')
    bookings.value = await res.json()
  } catch (err) {
    message.value = err.message
  }
}

function bookingStatusLabel(status) {
  if (status === 0) return 'Aktif'
  if (status === 1) return 'Selesai'
  return '-'
}

onMounted(() => {
  loadBookingHistory()
})
</script>

<style scoped>
/* Container pusat */
.container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
  font-family: Arial, sans-serif;
}

/* Tombol kembali */
.btn-back {
  padding: 6px 12px;
  margin-bottom: 10px;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-back:hover {
  background-color: #45a049;
}

/* Pesan error */
.message-error {
  color: red;
  margin-bottom: 10px;
}

/* Tabel booking */
.booking-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.booking-table th,
.booking-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}

.booking-table th {
  background-color: #f0f0f0;
}

.booking-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}

/* Teks jika tidak ada data */
.no-data {
  color: #666;
  margin-top: 10px;
}
</style>
