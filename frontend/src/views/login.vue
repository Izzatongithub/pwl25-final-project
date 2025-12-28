<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-header">
        <i class="fas fa-user-circle"></i>
        <h2>Selamat Datang Kembali</h2>
        <p>Silakan masuk ke akun Anda</p>
      </div>

      <form @submit.prevent="submit" class="auth-form">
        <div class="input-group">
          <i class="fas fa-envelope"></i>
          <input v-model="email" type="email" placeholder="Email Anda" required />
        </div>
        <div class="input-group">
          <i class="fas fa-lock"></i>
          <input v-model="password" type="password" placeholder="Password" required />
        </div>
        <button type="submit" class="btn-submit" :disabled="loading">Masuk Sekarang</button>
      </form>
      
      <p v-if="message" class="message">{{ message }}</p>
      
      <div class="auth-footer">
        Belum punya akun? <router-link to="/register">Daftar di sini</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch, decodeJwtPayload } from '../api.js'

const router = useRouter()

const email = ref('')
const password = ref('')
const message = ref('')
const loading = ref(false)

async function submit() {
  message.value = ''
  loading.value = true
  try {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      auth: false,
      body: {
        email: email.value,
        password: password.value,
      },
    })

    if (!data?.token) {
      throw new Error('Login gagal')
    }

    localStorage.setItem('token', data.token)
    const payload = decodeJwtPayload(data.token)
    const dest = payload?.role === 'admin' ? '/admin' : '/dashboard'
    router.push(dest)
  } catch (err) {
    message.value = err?.message || 'Login gagal'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrapper {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
}
.auth-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
}
.auth-header { text-align: center; margin-bottom: 30px; }
.auth-header i { font-size: 3rem; color: #4caf50; margin-bottom: 10px; }
.auth-header h2 { margin: 0; color: #333; }
.auth-header p { color: #777; font-size: 0.9rem; }

.input-group { position: relative; margin-bottom: 20px; }
.input-group i { position: absolute; left: 15px; top: 12px; color: #aaa; }
.input-group input {
  width: 100%;
  padding: 12px 12px 12px 45px;
  border: 2px solid #eee;
  border-radius: 10px;
  box-sizing: border-box;
  font-family: inherit;
}
.input-group input:focus { border-color: #4caf50; outline: none; }

.btn-submit {
  width: 100%;
  padding: 12px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}
.btn-submit:hover { background: #45a049; transform: translateY(-2px); }
.message { color: #f44336; margin-top: 15px; font-size: 0.85rem; }
.auth-footer { margin-top: 25px; font-size: 0.9rem; color: #666; }
.auth-footer a { color: #4caf50; font-weight: bold; text-decoration: none; }
</style>