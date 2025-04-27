import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import LogInView from '@/views/LogInView.vue'
import SignupView from '@/views/SignupView.vue'

import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { guestOnly: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LogInView,
      meta: { guestOnly: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
      meta: { guestOnly: true }
    }
  ],
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = useUserStore().isLoggedIn
  const guestOnly = to.meta.guestOnly

  if (guestOnly && isLoggedIn) {
    return next(false)
  } else if (!guestOnly && !isLoggedIn) {
    return next({ name: 'login' })
  } else {
    return next()
  }
})

export default router
