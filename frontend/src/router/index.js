import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/landing.vue'
import Login from '../views/login.vue'
import Register from '../views/register.vue'
import Dashboard from '../views/dashboard.vue'
import Booking from '../views/booking.vue'
import AdminPanel from '../views/adminPanel.vue'
import BookingHistory from '../views/bookingHistory.vue'
import { decodeJwtPayload } from '../api.js'

const routes = [
  { path: '/', component: Landing },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/booking', component: Booking, meta: { requiresAuth: true } },
  { path: '/admin', component: AdminPanel, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/booking-history', component: BookingHistory, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// route guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const payload = token ? decodeJwtPayload(token) : null
  const hasValidToken = Boolean(token && payload)

  if (token && !payload) {
    localStorage.removeItem('token')
  }

  if (to.meta.requiresAuth && !hasValidToken) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && hasValidToken) {
    // redirect ke halaman sesuai role
    const dest = payload?.role === 'admin' ? '/admin' : '/dashboard'
    next(dest)
  } else if (to.meta.requiresAdmin && payload?.role !== 'admin') {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
