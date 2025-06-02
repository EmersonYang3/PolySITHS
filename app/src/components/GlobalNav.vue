<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white bg-pure-black p-4"
  >
    <button class="text-2xl font-bold text-white cursor-pointer" @click="handleMenu">
      POLYSITHS
    </button>

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

      <div v-else class="flex items-center gap-3">
        <div
          class="flex items-center gap-2 px-3 py-1.5 rounded border border-border-light bg-soft-black"
        >
          <span class="text-xs text-text-secondary">Balance:</span>
          <span class="text-sm font-semibold text-purple-light">
            $<span ref="balanceCounter">0</span>
          </span>
        </div>

        <div class="relative" ref="profileDropdown">
          <button
            @click="toggleDropdown"
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
                class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-white hover:bg-black hover:text-purple-light cursor-pointer transition-colors"
                role="menuitem"
              >
                <User class="h-4 w-4" />
                Profile
              </button>
              <button
                @click="handleMarkets"
                class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-white hover:bg-black hover:text-purple-light cursor-pointer transition-colors"
                role="menuitem"
              >
                <BarChart3 class="h-4 w-4" />
                Markets
              </button>
              <button
                @click="handleLeaderboards"
                class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-white hover:bg-black hover:text-purple-light cursor-pointer transition-colors"
                role="menuitem"
              >
                <Trophy class="h-4 w-4" />
                Leaderboards
              </button>
              <button
                @click="handleLogout"
                class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-white hover:bg-black cursor-pointer hover:text-error transition-colors"
                role="menuitem"
              >
                <LogOut class="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { User, BarChart3, Trophy, LogOut } from 'lucide-vue-next'
import { gsap } from 'gsap'

const userStore = useUserStore()
const router = useRouter()

const isDropdownOpen = ref<boolean>(false)
const isLoggedIn = computed<boolean>(() => userStore.isLoggedIn)
const balanceCounter = ref<HTMLElement | null>(null)

const profileDropdown = ref<HTMLElement | null>(null)

function handleClickOutside(event: MouseEvent): void {
  if (
    isDropdownOpen.value &&
    profileDropdown.value &&
    !profileDropdown.value.contains(event.target as Node)
  ) {
    isDropdownOpen.value = false
  }
}

function animateBalance(): void {
  if (!balanceCounter.value || !userStore.userData?.balance) return

  const targetBalance = userStore.userData.balance
  const counterObj = { value: 0 }

  gsap.to(counterObj, {
    value: targetBalance,
    duration: 5,
    ease: 'power2.out',
    onUpdate: () => {
      if (balanceCounter.value) {
        balanceCounter.value.textContent = Math.floor(counterObj.value).toLocaleString()
      }
    },
  })
}

watch(
  () => userStore.userData?.balance,
  () => {
    if (isLoggedIn.value) {
      animateBalance()
    }
  },
  { immediate: true },
)

watch(isLoggedIn, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      animateBalance()
    }, 100)
  }
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (isLoggedIn.value) {
    setTimeout(() => {
      animateBalance()
    }, 100)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

function toggleDropdown(): void {
  isDropdownOpen.value = !isDropdownOpen.value
}

function handleMenu(): void {
  router.push({ name: 'home' })
}

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

function handleMarkets(): void {
  router.push({ name: 'markets' })
  isDropdownOpen.value = false
}

function handleLeaderboards(): void {
  router.push({ name: 'leaderboards' })
  isDropdownOpen.value = false
}

async function handleLogout() {
  await userStore.logOutUser()
  isDropdownOpen.value = false
}
</script>
