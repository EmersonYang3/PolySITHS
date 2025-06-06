<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white bg-pure-black p-4"
  >
    <BrandButton @navigateHome="navigateToHome" />

    <div class="flex items-center gap-2 sm:gap-4">
      <AuthButtons
        v-if="!isUserLoggedIn"
        @requestLogin="navigateToLogin"
        @requestSignup="navigateToSignup"
      />

      <template v-else>
        <BalanceIndicator :currentBalance="userStore.userData?.balance ?? 0" />

        <ProfileDropdown :profileUrl="userStore.userData?.profile_url">
          <button
            type="button"
            @click="navigateToProfile"
            class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-white hover:bg-black hover:text-purple-light cursor-pointer transition-colors"
            role="menuitem"
          >
            <User class="h-4 w-4" />
            Profile
          </button>
          <button
            type="button"
            @click="navigateToLeaderboards"
            class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-white hover:bg-black hover:text-purple-light cursor-pointer transition-colors"
            role="menuitem"
          >
            <Trophy class="h-4 w-4" />
            Leaderboards
          </button>
          <button
            type="button"
            @click="navigateToMarkets"
            class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-white hover:bg-black hover:text-purple-light cursor-pointer transition-colors"
            role="menuitem"
          >
            <BarChart3 class="h-4 w-4" />
            Markets
          </button>

          <button
            type="button"
            @click="performLogout"
            class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-white hover:bg-black cursor-pointer hover:text-error transition-colors"
            role="menuitem"
          >
            <LogOut class="h-4 w-4" />
            Sign out
          </button>
        </ProfileDropdown>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { BarChart3, LogOut, User, Trophy } from 'lucide-vue-next'

import BrandButton from './BrandButton.vue'
import AuthButtons from './AuthButtons.vue'
import BalanceIndicator from './BalanceIndicator.vue'
import ProfileDropdown from './ProfileDropdown.vue'

const userStore = useUserStore()
const router = useRouter()

const isUserLoggedIn = computed(() => userStore.isLoggedIn)

function navigateToHome() {
  router.push({ name: 'home' })
}

function navigateToLogin() {
  router.push({ name: 'login' })
}

function navigateToSignup() {
  router.push({ name: 'signup' })
}

function navigateToLeaderboards() {
  router.push({ name: 'leaderboards' })
}

function navigateToMarkets() {
  router.push({ name: 'markets' })
}

function navigateToProfile() {
  router.push({ name: 'profile', params: { id: userStore.userData?.user_id } })
}

async function performLogout() {
  const { success, error } = await userStore.logOutUser()

  if (success) {
    router.push('/login')
  }
}
</script>
