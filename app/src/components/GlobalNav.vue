<template>
  <nav class="sticky flex h-16 items-center justify-between border-b border-white p-4">
    <h1 class="text-2xl font-bold text-white">POLYSITHS</h1>

    <div class="flex items-center gap-2 sm:gap-4">
      <template v-if="!isLoggedIn">
        <button
          class="h-9 rounded border border-border-light bg-soft-black px-3 text-sm font-medium text-text-primary hover:bg-soft-black hover:text-purple-light sm:px-4 cursor-pointer transition-all"
          @click="handleLogin"
        >
          Log in
        </button>
        <button
          class="h-9 rounded bg-purple px-3 text-sm font-medium text-black hover:bg-purple-dark sm:px-4 cursor-pointer transition-all"
          @click="handleSignUp"
        >
          Sign up
        </button>
      </template>

      <div v-else class="relative" ref="profileDropdown">
        <button
          @click="isDropdownOpen = !isDropdownOpen"
          class="flex h-9 w-9 items-center justify-center rounded-full border border-border-light bg-soft-black text-white hover:border-purple cursor-pointer transition-all"
          aria-haspopup="true"
          :aria-expanded="isDropdownOpen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <div
          v-show="isDropdownOpen"
          class="absolute right-0 mt-2 w-48 origin-top-right rounded border border-border-light bg-soft-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
        >
          <div class="py-1" role="none">
            <button
              @click="handleProfile"
              class="block w-full text-left px-4 py-2 text-sm text-white hover:bg-black hover:text-purple-light cursor-pointer transition-colors"
              role="menuitem"
            >
              Profile
            </button>
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-sm text-white hover:bg-black cursor-pointer hover:text-error transition-colors"
              role="menuitem"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { supabase } from '@/lib/supabaseClient'

const userStore = useUserStore()
const router = useRouter()

const isDropdownOpen = ref<boolean>(false)
const isLoggedIn = computed<boolean>(() => userStore.isLoggedIn)

const profileDropdown: Ref<HTMLElement | null> = ref(null)

function handleClickOutside(event: MouseEvent): void {
  if (
    isDropdownOpen.value &&
    profileDropdown.value &&
    !profileDropdown.value.contains(event.target as Node)
  ) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleLogin(): void {
  router.push({ name: 'login' })
}

function handleSignUp(): void {
  router.push({ name: 'signup' })
}

function handleProfile(): void {
  router.push({ name: 'profile' })
  isDropdownOpen.value = false
}

async function handleLogout(): Promise<void> {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error.message)
    return
  }
  
  userStore.isLoggedIn = false
  router.push({ name: 'login' })
}
</script>
