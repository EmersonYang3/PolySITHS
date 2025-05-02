import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useUserStore } from '@/stores/user'

export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const userStore = useUserStore()

  const logged = Boolean(userStore.isLoggedIn)

  if (to.meta.requiresAuth && !logged) {
    return next({
      name: 'login',
      query: { redirect: to.fullPath },
    })
  }

  if (to.meta.requiresGuest && logged) {
    return next({ name: 'dashboard' })
  }

  return next()
}
