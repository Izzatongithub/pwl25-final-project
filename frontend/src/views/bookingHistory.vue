<template>
  <div class="container">
    <header class="page-header">
      <h2>Riwayat Booking</h2>
      <button class="btn-back" @click="goBack">Kembali ke Dashboard</button>
    </header>

    <div class="content">
      <div v-if="message" class="message-error">{{ message }}</div>

      <table v-if="bookings.length" class="booking-table">
      <thead>
        <tr>
          <th>#</th>
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

    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="footer-logo"><i class="fas fa-futball"></i> BookMyField</div>
          <div class="footer-tagline">Solusi booking lapangan futsal yang cepat dan modern.</div>
        </div>

        <div class="footer-cols">
          <div class="footer-col">
            <div class="footer-col-title">Produk</div>
            <a class="footer-link" href="#" @click.prevent="scrollToFields">Lapangan</a>
            <a class="footer-link" href="#" @click.prevent="goRegister">Daftar</a>
          </div>

          <div class="footer-col">
            <div class="footer-col-title">Lainnya</div>
            <a class="footer-link" href="#" @click.prevent="goLogin">Login</a>
            <a class="footer-link" href="#" @click.prevent="goHome">Beranda</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">&copy; 2025 BookMyField.</div>
    </footer>
    
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { apiFetch } from '../api.js'

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

function bookingStatusLabel(status) {
  if (status === 0) return 'Aktif'
  if (status === 1) return 'Selesai'
  return '-'
}

async function loadBookingHistory() {
  try {
    bookings.value = await apiFetch('/api/bookings/user')
  } catch (err) {
    message.value = err?.message || 'Gagal mengambil data'
  }
}

onMounted(() => {
  loadBookingHistory()
})
</script>



<style scoped>
/* Container pusat */
.container {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
}

.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  z-index: 9000;
}
.page-header h2 { margin: 0; }
.page-header .btn-back { margin: 0; }

.content {
  flex: 1;
  margin-top: 68px; /* space for fixed header */
  padding: 0; /* make content full-bleed */
  overflow: auto;
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
  width: 98%;
  border-collapse: collapse;
  margin-top: 20px;
  margin-left: 15px;
  margin-right: 10px;
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

.footer {
  background: #0f0f0f;
  color: rgba(255, 255, 255, 0.82);
}

.footer-inner {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 20px;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 26px;
}

.footer-logo {
  font-weight: 900;
  color: #4caf50;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.footer-tagline {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

.footer-cols {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.footer-col-title {
  font-weight: 900;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.92);
}

.footer-link {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  margin-bottom: 8px;
}

.footer-link:hover {
  color: white;
}

.footer-bottom {
  text-align: center;
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .features-inner {
    grid-template-columns: 1fr;
  }

  .field-grid {
    grid-template-columns: 1fr;
  }

  .footer-inner {
    grid-template-columns: 1fr;
  }

  .hero-title {
    font-size: 2.6rem;
  }
}

</style>