<template>
  <div class="landing">
    <header class="nav">
      <div class="nav-inner">
        <div class="brand" @click="goHome"><i class="fas fa-futball"></i> BookMyField</div>
        <div class="nav-actions">
          <button class="nav-link" type="button" @click="scrollToFields">Lapangan</button>
          <button class="nav-login" type="button" @click="goLogin">Login</button>
        </div>
      </div>
    </header>

    <section class="hero">
      <div class="hero-overlay">
        <div class="hero-content">
          <h1 class="hero-title">BOOKING LAPANGAN <br />JADI LEBIH GAMPANG</h1>
          <p class="hero-subtitle">
            Temukan lapangan terbaik di sekitarmu dan booking hanya dengan beberapa klik.
          </p>
          <div class="cta-group">
            <button class="btn btn-main" type="button" @click="goRegister">Mulai Sekarang</button>
            <!--<button class="btn btn-alt" type="button" @click="goLogin">Masuk</button>-->
          </div>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="features-inner">
        <div class="feature">
          <div class="feature-icon"><i class="fas fa-bolt"></i></div>
          <div class="feature-title">Instant Booking</div>
          <div class="feature-desc">Booking lapangan cepat tanpa ribet.</div>
        </div>
        <div class="feature">
          <div class="feature-icon"><i class="fas fa-calendar-check"></i></div>
          <div class="feature-title">Flexible Schedule</div>
          <div class="feature-desc">Pilih jadwal yang pas untuk tim kamu.</div>
        </div>
        <div class="feature">
          <div class="feature-icon"><i class="fas fa-star"></i></div>
          <div class="feature-title">Trusted</div>
          <div class="feature-desc">Temukan lapangan favorit yang terpercaya.</div>
        </div>
      </div>
    </section>

    <section class="fields" id="fields">
      <div class="section-inner">
        <h2 class="section-title">Explore Our Fields</h2>
        <div class="field-grid">
          <div class="field-card" v-for="f in fields" :key="f.id">
            <div class="field-image">
              <img :src="f.image ? absoluteImage(f.image) : 'https://images.unsplash.com/photo-1604754742621-2f6d3b35a1d9?auto=format&fit=crop&w=1200&q=80'" :alt="f.name" />
            </div>
            <div class="field-body">
              <h3 class="field-title">{{ f.name }}</h3>
              <p class="field-desc">{{ f.deskripsi || f.type || 'Deskripsi tidak tersedia' }}</p>
              <button class="btn btn-ghost" type="button" @click="() => $router.push({ path: '/booking', query: { field_id: f.id } })">Lihat Detail Lapangan</button>
            </div>
          </div>
        </div>
      </div>
    </section>

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
import { apiFetch, API_BASE_URL } from '../api.js'

const router = useRouter()
const goRegister = () => router.push('/register')
const goLogin = () => router.push('/login')
const goHome = () => router.push('/')

const fields = ref([])

function scrollToFields() {
  const el = document.getElementById('fields')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function absoluteImage(path) {
  if (!path) return ''
  if (path.startsWith('http') || path.startsWith('data:')) return path
  return API_BASE_URL.replace(/\/$/, '') + path
}

onMounted(async () => {
  try {
    const data = await apiFetch('/api/fields')
    fields.value = Array.isArray(data) ? data : []
  } catch (err) {
    fields.value = []
  }
})
</script>

<style scoped>
.landing {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f4f7f6;
}

/* pastikan footer berada di bawah ketika konten pendek */
.landing .footer {
  margin-top: auto;
}

.nav {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
}

.nav-inner {
  background: white; 
  padding: 15px 50px; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  box-shadow: 0 2px 10px rgba(0,0,0,0.05); 
}

.brand {
  font-weight: 800;
  font-size: 1.2rem;
  color: #4caf50;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-link {
  background: transparent;
  border: none;
  font-weight: 700;
  color: #333;
  cursor: pointer;
  padding: 10px 12px;
  border-radius: 10px;
}

.nav-link:hover {
  background: rgba(0, 0, 0, 0.05);
}

.nav-login {
  border: none;
  background: #2e7d32;
  color: white;
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
}

.nav-login:hover {
  opacity: 0.92;
}

.hero {
  min-height: calc(100vh - 58px);
  background: url('https://images.unsplash.com/photo-1641029185333-7ed62a19d5f0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') center/cover no-repeat;
}

.hero-overlay {
  min-height: inherit;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.hero-content {
  text-align: center;
  color: white;
  max-width: 900px;
}

.hero-title {
  font-size: 3.4rem;
  margin: 0 0 18px;
  font-weight: 900;
  letter-spacing: 1px;
  line-height: 1.05;
}

.hero-subtitle {
  font-size: 1.15rem;
  margin: 0 auto 26px;
  opacity: 0.92;
  max-width: 700px;
}

.cta-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.btn {
  padding: 14px 34px;
  border-radius: 999px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s;
  font-size: 1rem;
  border: none;
}

.btn-main {
  background: #4caf50;
  color: white;
  box-shadow: 0 8px 18px rgba(76, 175, 80, 0.35);
}

.btn-main:hover {
  background: #45a049;
  transform: translateY(-2px);
}

.btn-alt {
  background: white;
  color: #333;
}

.btn-alt:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
}

.btn-ghost {
  width: 100%;
  background: #f5f5f5;
  color: #333;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.btn-ghost:hover {
  background: #ededed;
}

.features {
  background: linear-gradient(180deg, rgba(46, 125, 50, 0.18), rgba(46, 125, 50, 0.06));
  padding: 26px 20px;
}

.features-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.feature {
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 18px;
  padding: 16px 16px;
  display: grid;
  grid-template-columns: 44px 1fr;
  column-gap: 12px;
  align-items: center;
}

.feature-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(76, 175, 80, 0.18);
  color: #2e7d32;
  font-size: 1.2rem;
}

.feature-title {
  font-weight: 900;
  color: #1f2a1f;
}

.feature-desc {
  grid-column: 2;
  color: rgba(0, 0, 0, 0.65);
  font-size: 0.92rem;
  margin-top: 2px;
}

.fields {
  padding: 46px 20px 60px;
  background: linear-gradient(180deg, #2e7d32, #1c1c1c);
  scroll-margin-top: 80px;
}

.section-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  color: white;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 900;
  margin: 0 0 30px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.field-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.field-image {
  height: 160px;
  overflow: hidden;
}

.field-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.field-body {
  padding: 16px;
  text-align: center;
}

.field-title {
  margin: 0 0 10px;
  font-weight: 900;
  text-transform: uppercase;
  font-size: 0.95rem;
}

.field-desc {
  margin: 0 0 14px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 0.92rem;
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