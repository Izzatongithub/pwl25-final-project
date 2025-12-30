<template>
  <div class="page-bg">
    <div class="booking-container">
      <div class="header">
        <button class="back-btn" @click="$router.push('/dashboard')"><i class="fas fa-arrow-left"></i></button>
        <h2>Reservasi Lapangan</h2>
      </div>

      <div class="booking-card">
        <div v-if="message" class="alert">{{ message }}</div>

        <div v-if="selectedFieldData" class="field-detail">
          <div class="field-image-lg">
              <img :src="selectedFieldData ? (selectedFieldData.image ? absoluteImage(selectedFieldData.image) : 'https://images.unsplash.com/photo-1604754742621-2f6d3b35a1d9?auto=format&fit=crop&w=1200&q=80') : 'https://images.unsplash.com/photo-1604754742621-2f6d3b35a1d9?auto=format&fit=crop&w=1200&q=80'" :alt="selectedFieldData?.name || 'Lapangan'" />
          </div>
          <div class="field-info">
            <h3 class="field-name">{{ selectedFieldData.name }}</h3>
            <p class="field-desc">{{ selectedFieldData.deskripsi || selectedFieldData.type || 'Deskripsi tidak tersedia' }}</p>
            <div class="field-meta">
              <span class="meta-item"><i class="fas fa-map-marker-alt"></i> {{ selectedFieldData.location || 'Mataram' }}</span>
              <span class="meta-item"><i class="fas fa-tag"></i> {{ selectedFieldData.type || '-' }}</span>
            </div>
          </div>
          <div class="booking-icon">
            <i class="fas fa-calendar-check"></i>
          </div>
        </div>

        <form @submit.prevent="submitBooking">

          <div class="form-group">
            <label><i class="fas fa-calendar-day"></i> Pilih Tanggal</label>
            <input type="date" v-model="date" required />
          </div>

          <div class="slot-section" v-if="slots.length > 0">
            <label><i class="fas fa-clock"></i> Pilih Jam Tersedia</label>
            <div class="slot-grid">
              <div v-for="s in slots" :key="s.id" 
                class="slot-item" 
                :class="{ 'booked': !s.available, 'selected': selectedSlot === s.id }"
                @click="s.available ? selectedSlot = s.id : null">
                <span class="time">{{ s.display }}</span>
              </div>
            </div>
          </div>

          <div class="summary" v-if="selectedSlot">
             <div class="total-row">
               <span>Total Bayar:</span>
               <span class="final-price">Rp {{ totalPrice.toLocaleString() }}</span>
             </div>
             <button type="submit" class="btn-confirm" :disabled="loading">Booking Sekarang</button>
          </div>
        </form>
      </div>
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
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiFetch, API_BASE_URL } from '../api.js'

const router = useRouter()
const route = useRoute()

const fields = ref([])
const slots = ref([])

const selectedField = ref('')
const date = ref('')
const selectedSlot = ref(null)

const message = ref('')
const loading = ref(false)

const totalPrice = computed(() => {
  const slot = slots.value.find(s => s.id === selectedSlot.value)
  return slot?.price || 0
})

const selectedFieldData = computed(() => {
  return fields.value.find(f => String(f.id) === String(selectedField.value)) || null
})

function absoluteImage(path) {
  if (!path) return ''
  if (path.startsWith('http') || path.startsWith('data:')) return path
  return API_BASE_URL.replace(/\/$/, '') + path
}

async function loadFields() {
  fields.value = await apiFetch('/api/fields')
}

async function loadSlots() {
  slots.value = []
  selectedSlot.value = null
  message.value = ''

  if (!selectedField.value || !date.value) return

    try {
    const apiSlots = await apiFetch(`/api/bookings/time-slots?field_id=${selectedField.value}&date=${encodeURIComponent(date.value)}`) || []

    // Map API slots directly and format display like "HH.MM-HH.MM"
    slots.value = (Array.isArray(apiSlots) ? apiSlots : []).map(s => {
      const st = (s.start_time || '').substring(0,5).replace(':', '.')
      const et = (s.end_time || '').substring(0,5).replace(':', '.')
      return {
        id: s.id,
        field_id: s.field_id,
        start_time: s.start_time,
        end_time: s.end_time,
        display: `${st}-${et}`,
        price: s.price || 0,
        available: typeof s.available === 'boolean' ? s.available : (s.status !== 1),
      }
    })
  } catch (err) {
    message.value = err?.message || 'Gagal mengambil slot'
  }
}

async function submitBooking() {
  message.value = ''

  if (!selectedField.value || !date.value || !selectedSlot.value) {
    message.value = 'Lengkapi pilihan lapangan, tanggal, dan jam'
    return
  }

  loading.value = true
  try {
    const data = await apiFetch('/api/bookings', {
      method: 'POST',
      body: {
        field_id: Number(selectedField.value),
        booking_date: date.value,
        time_slot_id: Number(selectedSlot.value),
      },
    })

    message.value = data?.message || 'Booking berhasil'
    setTimeout(() => {
      router.push('/booking-history')
    }, 800)
  } catch (err) {
    message.value = err?.message || 'Booking gagal'
  } finally {
    loading.value = false
  }
}

watch([selectedField, date], () => {
  loadSlots()
})

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
    return
  }

  try {
    await loadFields()
    // jika ada query field_id dari dashboard, pre-select
    const qField = route.query.field_id || route.query.fieldId
    if (qField) {
      selectedField.value = String(qField)
      // slots akan dimuat oleh watch pada selectedField/date
    }
  } catch (err) {
    message.value = err?.message || 'Gagal mengambil lapangan'
  }
})
</script>

<style scoped>
.page-bg { 
  padding: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.booking-container { 
  max-width: 1430px;
  width: 100%;
  margin: 0;
  padding: 0 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.header { 
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}
.back-btn { 
  background: white;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.booking-card { 
  background: white;
  border-radius: 0;
  padding: 35px;
  box-shadow: none;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.form-group { 
  margin-bottom: 20px;
  text-align: left;
  display: flex;
  flex-direction: column;
}
label { 
  font-size: 0.85rem;
  font-weight: 700;
  color: #555;
  margin-bottom: 10px;
}
select, input { 
  padding: 15px;
  border: 2px solid #f0f0f0;
  border-radius: 15px;
  font-family: inherit;
  font-size: 1rem;
}
select:focus { 
  border-color: #4caf50;
  outline: none;
}
.slot-grid { 
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 10px;
}
.slot-item { 
  border: 2px solid #f0f0f0;
  padding: 15px 10px;
  border-radius: 15px;
  cursor: pointer;
  text-align: center;
  transition: 0.2s;
}
.slot-item.selected { 
  background: #4caf50;
  border-color: #4caf50;
  color: white;
}
.slot-item.selected .price { 
  color: white;
}
.booked { 
  background: #f9f9f9;
  opacity: 0.5;
  cursor: not-allowed;
}
.price { 
  display: block;
  font-size: 0.75rem;
  color: #4caf50;
  font-weight: bold;
}
.btn-confirm { 
  width: 100%;
  background: #4caf50;
  color: white;
  border: none;
  padding: 18px;
  border-radius: 15px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
}

.field-detail {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 18px;
}
.field-image-lg { 
  width: 42%;
  max-width: 240px;
  border-radius: 12px;
  overflow: hidden;
}
.field-image-lg img { 
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.field-info { 
  flex: 1;
  text-align: left;
}
.field-name { 
  margin: 0 0 6px;
  font-weight: 900;
  font-size: 1.05rem;
}
.field-desc { 
  margin: 0 0 8px;
  color: rgba(0,0,0,0.7);
}
.field-meta { 
  display: flex;
  gap: 12px;
  color: rgba(0,0,0,0.6);
  font-size: 0.9rem;
}
.meta-item i { 
  margin-right: 6px;
  color: #2e7d32;
}
.booking-icon { 
  font-size: 28px;
  color: #2e7d32;
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