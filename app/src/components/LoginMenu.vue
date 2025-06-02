<template>
  <div class="w-full max-w-md rounded border border-border-light bg-soft-black p-6">
    <h2 class="mb-6 text-2xl font-bold text-purple">Log In</h2>

    <form class="text-text-primary" @submit.prevent="onSubmit">
      <div class="mb-4">
        <label for="email" class="mb-2 block text-sm font-medium text-purple-light"> Email: </label>
        <input
          type="email"
          id="email"
          v-model="email"
          class="w-full rounded border border-border-light bg-black p-3 text-white focus:border-purple focus:outline-none"
          required
        />
        <p v-if="email && !isEmailValid" class="mt-1 text-sm text-error">
          Email must include an @!
        </p>
      </div>

      <div class="mb-4">
        <label for="password" class="mb-2 block text-sm font-medium text-purple-light">
          Password:
        </label>
        <div class="relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            class="w-full rounded border border-border-light bg-black p-3 text-white focus:border-purple focus:outline-none"
            required
          />
          <button
            type="button"
            @click="togglePasswordVisibility"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-purple-light focus:outline-none"
            aria-label="Toggle password visibility"
          >
            <Eye v-if="!showPassword" class="h-5 w-5 cursor-pointer" />
            <EyeOff v-else class="h-5 w-5 cursor-pointer" />
          </button>
        </div>
      </div>

      <!-- TODO: Add remember me checkbox and forgot password functionality (later)
      <div class="mb-4 flex items-center">
        <input
          type="checkbox"
          id="remember"
          v-model="rememberMe"
          class="h-4 w-4 rounded border-border-light bg-black text-purple focus:ring-purple"
        />
        <label for="remember" class="ml-2 block text-sm text-text-secondary"> Remember me </label>
        <a href="#" class="ml-auto text-sm text-purple-light hover:text-purple">
          Forgot password?
        </a>
      </div>
      -->

      <button
        type="submit"
        class="mt-4 w-full rounded bg-purple py-3 text-sm font-medium text-white cursor-pointer transition-all enabled:active:scale-95 hover:bg-purple-dark disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!isFormValid || isLoading"
        :class="{ 'opacity-70': isLoading }"
      >
        <span v-if="isLoading">Logging in...</span>
        <span v-else>Log In</span>
      </button>
    </form>

    <p v-if="isSuccess" class="text-center mt-1 text-sm text-success">Login successful!</p>
    <p v-if="errorMessage" class="text-center mt-1 text-sm text-error">
      {{ errorMessage }}
    </p>

    <div class="mt-4 flex gap-1 text-text-primary">
      <p>Don't have an account?</p>
      <router-link
        to="/signup"
        class="cursor-pointer text-purple-light hover:text-purple underline"
      >
        Sign up
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { Eye, EyeOff } from 'lucide-vue-next'

const userStore = useUserStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const isLoading = ref(false)
const isSuccess = ref(false)
const showPassword = ref(false)

const isEmailValid = computed(() => email.value.includes('@'))
const isFormValid = computed(() => isEmailValid.value && password.value)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const onSubmit = async () => {
  errorMessage.value = ''
  isSuccess.value = false
  isLoading.value = true

  const data = await userStore.logInUser(email.value, password.value)

  isLoading.value = false

  if (!data.success) {
    errorMessage.value = data.error
    return
  }

  isSuccess.value = true
}
</script>
