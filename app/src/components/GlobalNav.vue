<template>
  <nav class="sticky flex h-16 items-center justify-between border-b border-white p-4">
    <h1 class="text-2xl font-bold text-white">POLYSITHS</h1>

    <div class="flex items-center gap-2 sm:gap-4">
      <button
        v-if="!isLoggedIn"
        class="h-9 rounded border border-border-light bg-soft-black px-3 text-sm font-medium text-text-primary hover:bg-soft-black hover:text-purple-light sm:px-4 cursor-pointer transition-all"
        @click="handleLogin"
      >
        Log in
      </button>
      <button
        v-if="!isLoggedIn"
        class="h-9 rounded bg-purple px-3 text-sm font-medium text-black hover:bg-purple-dark sm:px-4 cursor-pointer transition-all"
        @click="handleSignUp"
      >
        Sign up
      </button>
      <button
        v-if="isLoggedIn"
        class="h-9 rounded bg-error px-3 text-sm font-medium text-white hover:bg-error-dark sm:px-4 cursor-pointer transition-all"
        @click="handleLogout"
      >
        Logout
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)
const router = useRouter()

function handleLogin() {
  router.push('login')
}

function handleSignUp() {
  router.push('signup')
}

function handleLogout() {
  supabase.auth.signOut().then(() => {
    userStore.isLoggedIn = false
    router.push('/')
  })
}
</script>
