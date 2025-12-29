<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-header">
        <i class="fas fa-user-plus"></i>
        <h2>Buat Akun Baru</h2>
        <p>Bergabunglah dengan komunitas pemain futsal</p>
      </div>

      <form @submit.prevent="register" class="auth-form">
        <div class="input-group">
          <i class="fas fa-user"></i>
          <input v-model="name" type="text" placeholder="Nama Lengkap" required />
        </div>
        <div class="input-group">
          <i class="fas fa-envelope"></i>
          <input v-model="email" type="email" placeholder="Email Aktif" required />
        </div>
        <div class="input-group">
          <i class="fas fa-lock"></i>
          <input v-model="password" type="password" placeholder="Masukkan Password" required />
        </div>
        <button type="submit" class="btn-submit" :disabled="loading">Daftar Sekarang</button>
      </form>
      
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
      
      <div class="auth-footer">
        Sudah punya akun? <router-link to="/login">Login Sekarang</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from '../api.js'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')

const error = ref('')
const success = ref('')
const loading = ref(false)

async function register() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    const data = await apiFetch('/api/auth/register', {
      method: 'POST',
      auth: false,
      body: {
        name: name.value,
        email: email.value,
        password: password.value,
      },
    })

    success.value = data?.message || 'Register berhasil'
    setTimeout(() => {
      router.push('/login')
    }, 600)
  } catch (err) {
    error.value = err?.message || 'Register gagal'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrapper { height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); }
.auth-card { background: white; padding: 40px; border-radius: 20px; width: 100%; max-width: 400px; box-shadow: 0 15px 35px rgba(0,0,0,0.2); text-align: center;}
.auth-header { margin-bottom: 25px; }
.auth-header i { font-size: 3rem; color: #4caf50; margin-bottom: 10px; }
.input-group { position: relative; margin-bottom: 15px; text-align: left;}
.input-group i { position: absolute; left: 15px; top: 12px; color: #aaa; }
.input-group input { width: 100%; padding: 12px 12px 12px 45px; border: 2px solid #eee; border-radius: 10px; box-sizing: border-box; }
.btn-submit { width: 100%; padding: 12px; background: #4caf50; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; transition: 0.3s; margin-top: 10px;}
.error { color: #f44336; margin-top: 10px; }
.success { color: #4caf50; margin-top: 10px; }
.auth-footer { margin-top: 20px; font-size: 0.9rem; }
.auth-footer a { color: #4caf50; font-weight: bold; text-decoration: none; }
</style>