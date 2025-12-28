<template>
  <div class="dashboard">
    <nav class="topbar">
      <div class="topbar-left">
        <div class="brand" @click="goHome"><i class="fas fa-futball"></i> BookMyField</div>
      </div>

      <div class="topbar-center">Halo, {{ displayName }}</div>

      <div class="topbar-right">
        <button v-if="userRole === 'user'" class="topbar-link" type="button" @click="goHistory">HISTORY</button>
        <button v-if="userRole === 'admin'" class="topbar-link" type="button" @click="goAdmin">ADMIN</button>
        <button class="topbar-logout" type="button" @click="logout"><i class="fas fa-sign-out-alt"></i> Keluar</button>
      </div>
    </nav>

    <main class="main">
      <h1 class="headline">NIKMATI LAPANGAN TERBAIK DI KOTA MATARAM</h1>

      <section v-if="userRole === 'user'" class="cards-wrap">
        <div class="cards-grid">
          <div class="card" v-for="f in featuredFields" :key="f.id">
            <div class="card-image">
              <img :src="f.image" />
            </div>
            <div class="card-body">
              <div class="card-title">{{ f.name }}</div>
              <div class="card-subtitle">{{ f.location }}</div>
              <div class="card-price">Harga: <span class="price">{{ formatRupiah(f.price) }}</span></div>
              <button class="card-button" type="button" @click="goBooking(f)">BOOKING SEKARANG</button>
            </div>
          </div>
        </div>
      </section>

      <!-- admin UI moved to separate admin dashboard -->
    </main>
    
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { decodeJwtPayload, apiFetch } from '../api.js'

const router = useRouter()
const userRole = ref('')
const displayName = ref('User')

const featuredFields = ref([])

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
    return
  }

  try {
    const payload = decodeJwtPayload(token)
    if (!payload) throw new Error('Token tidak valid')
    
    userRole.value = payload.role || 'user'
    displayName.value = payload.name || payload.username || 'User'
  } catch (error) {
    console.error('Token Error:', error)
    logout()
    return
  }

  // ambil lapangan dari API
  try {
    const data = await apiFetch('/api/fields')
    featuredFields.value = Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Gagal ambil lapangan:', err?.message || err)
    featuredFields.value = []
  }
})

function goHome() {
  router.push('/')
}

function goHistory() {
  router.push('/booking-history')
}

function goBooking(field) {
  // arahkan ke halaman booking dan sertakan id lapangan
  router.push({ path: '/booking', query: { field_id: field?.id } })
}

function goAdmin() {
  router.push('/admin')
}

function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
}

function logout() {
  localStorage.clear()
  router.push('/')
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.topbar {
  background: white;
  padding: 14px 50px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.brand {
  color: #4caf50;
  font-weight: 800;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.topbar-center {
  font-weight: 700;
  color: #222;
}

.topbar-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 14px;
}

.topbar-link {
  border: none;
  background: transparent;
  font-weight: 800;
  cursor: pointer;
  color: #1f1f1f;
}

.topbar-link:hover {
  text-decoration: underline;
}

.topbar-logout {
  border: none;
  background: transparent;
  color: #f44336;
  cursor: pointer;
  font-weight: 800;
  font-family: inherit;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 26px 20px 50px;
  flex: 1; /* biarkan area utama mengembang sehingga footer tetap di bawah */
}

.headline {
  text-align: center;
  font-weight: 900;
  font-style: italic;
  letter-spacing: 0.5px;
  margin: 14px 0 22px;
}

.cards-wrap {
  background: #f6f7f7;
  border-radius: 18px;
  padding: 18px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.card {
  background: white;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.06);
}

.card-image {
  height: 220px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease;
}

.card:hover .card-image img {
  transform: scale(1.05);
}

.card-body {
  padding: 18px 16px 20px;
}

.card-title {
  font-weight: 900;
  font-size: 1rem;
  text-transform: uppercase;
  margin-bottom: 6px;
  color: #111;
}

.card-subtitle {
  font-size: 0.82rem;
  color: rgba(0,0,0,0.55);
  margin-bottom: 6px;
}

.card-price {
  font-size: 0.95rem;
  margin-bottom: 12px;
  color: rgba(0,0,0,0.8);
}

.price {
  font-weight: 900;
  color: #2e7d32;
}

.card-button {
  width: 100%;
  background: #2e7d32;
  color: white;
  border: none;
  border-radius: 999px;
  padding: 10px 12px;
  font-weight: 900;
  cursor: pointer;
}

.card-button:hover {
  opacity: 0.95;
}

.admin-box {
  display: flex;
  justify-content: center;
}

.admin-card {
  margin-top: 20px;
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 16px;
  padding: 18px;
}

.admin-title {
  font-weight: 900;
  margin-bottom: 6px;
}

.admin-desc {
  color: rgba(0,0,0,0.65);
  margin-bottom: 14px;
}

.admin-button {
  width: 100%;
  background: #2e7d32;
  color: white;
  border: none;
  border-radius: 999px;
  padding: 12px 14px;
  font-weight: 900;
  cursor: pointer;
}

@media (max-width: 1100px) {
  .cards-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .topbar {
    padding: 14px 20px;
  }
}

@media (max-width: 560px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }

  .topbar {
    grid-template-columns: 1fr;
    row-gap: 10px;
    text-align: center;
  }

  .topbar-right {
    justify-content: center;
    flex-wrap: wrap;
  }
}
.footer {
  background: #0f0f0f;
  color: rgba(255, 255, 255, 0.82);
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 34px 20px;
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