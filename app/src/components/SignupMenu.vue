<template>
  <div class="w-full max-w-md rounded border border-border-light bg-soft-black p-6">
    <h2 class="mb-6 text-2xl font-bold text-purple">Sign Up</h2>

    <form class="text-text-primary" @submit.prevent="onSubmit">
      <div class="mb-4">
        <label for="email" class="mb-2 block text-sm font-medium text-purple-light">Email:</label>
        <input
          id="email"
          type="email"
          v-model="email"
          required
          class="w-full rounded border border-border-light bg-black p-3 text-white focus:border-purple focus:outline-none"
        />
        <p v-if="email && !isEmailValid" class="mt-1 text-sm text-error">
          Email must include an @!
        </p>
      </div>

      <div class="mb-4">
        <label for="password" class="mb-2 block text-sm font-medium text-purple-light"
          >Password:</label
        >
        <div class="relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            required
            class="w-full rounded border border-border-light bg-black p-3 text-white focus:border-purple focus:outline-none"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-purple-light focus:outline-none"
            aria-label="Toggle password visibility"
          >
            <Eye v-if="!showPassword" class="h-5 w-5 cursor-pointer" />
            <EyeOff v-else class="h-5 w-5 cursor-pointer" />
          </button>
        </div>
        <p v-if="password && !isPasswordValid" class="mt-1 text-sm text-error">
          Password must be at least 6 characters!
        </p>
      </div>

      <div class="mb-4">
        <label for="confirmPassword" class="mb-2 block text-sm font-medium text-purple-light"
          >Confirm Password:</label
        >
        <div class="relative">
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            id="confirmPassword"
            v-model="confirmPassword"
            required
            class="w-full rounded border border-border-light bg-black p-3 text-white focus:border-purple focus:outline-none"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-purple-light focus:outline-none"
            aria-label="Toggle confirm password visibility"
          >
            <Eye v-if="!showConfirmPassword" class="h-5 w-5 cursor-pointer" />
            <EyeOff v-else class="h-5 w-5 cursor-pointer" />
          </button>
        </div>
        <p v-if="confirmPassword && !doPasswordsMatch" class="mt-1 text-sm text-error">
          Passwords must match!
        </p>
      </div>

      <button
        type="submit"
        :disabled="!isFormValid || isLoading"
        :class="{ 'opacity-70': isLoading }"
        class="mt-4 w-full rounded bg-purple py-3 text-sm font-medium text-white transition-all enabled:active:scale-95 hover:bg-purple-dark disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <span v-if="isLoading">Signing up...</span>
        <span v-else>Sign Up</span>
      </button>

      <p v-if="isSuccess" class="text-center mt-1 text-sm text-success">
        Logging in... Please wait!
      </p>
      <p v-if="errorMessage" class="text-center mt-1 text-sm text-error">{{ errorMessage }}</p>
    </form>

    <div class="mt-4 flex gap-1 text-text-primary">
      <p>Have an account?</p>
      <router-link to="/login" class="text-purple-light hover:text-purple underline"
        >Log in</router-link
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

const isEmailValid = computed(() => email.value.includes('@'))
const isPasswordValid = computed(() => password.value.length >= 6)
const doPasswordsMatch = computed(() => password.value === confirmPassword.value)
const isFormValid = computed(
  () => isEmailValid.value && isPasswordValid.value && doPasswordsMatch.value && email.value,
)

const onSubmit = async () => {
  errorMessage.value = ''
  isSuccess.value = false
  isLoading.value = true

  const data = await userStore.signUpUser(email.value, password.value)

  isLoading.value = false

  if (data.success) {
    isSuccess.value = true
    const data = await userStore.logInUser(email.value, password.value)

    if (data.success) {
      router.push('/markets')
    }
  } else {
    errorMessage.value = data.error
  }
}
</script>
