import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import { authGuard } from './authGuard'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LogInView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/SignupView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/markets',
    name: 'markets',
    component: () => import('@/views/MarketsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/:id',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: '/leaderboards',
    name: 'leaderboards',
    component: () => import('@/views/LeaderboardsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/market/:id',
    name: 'market',
    component: () => import('@/views/MarketDetailView.vue'),
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'home' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(authGuard)

export default router
