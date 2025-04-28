<template>
  <div class="w-full max-w-md rounded border border-border-light bg-soft-black p-6">
    <h2 class="mb-6 text-2xl font-bold text-purple">Sign Up</h2>

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
        <input
          type="password"
          id="password"
          v-model="password"
          class="w-full rounded border border-border-light bg-black p-3 text-white focus:border-purple focus:outline-none"
          required
        />
        <p v-if="password && !isPasswordValid" class="mt-1 text-sm text-error">
          Password must be at least 6 characters!
        </p>
      </div>

      <div class="mb-4">
        <label for="confirmPassword" class="mb-2 block text-sm font-medium text-purple-light">
          Confirm Password:
        </label>
        <input
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          class="w-full rounded border border-border-light bg-black p-3 text-white focus:border-purple focus:outline-none"
          required
        />
        <p v-if="confirmPassword && !doPasswordsMatch" class="mt-1 text-sm text-error">
          Confirm password must be the same as password!
        </p>
      </div>

      <button
        type="submit"
        class="mt-4 w-full rounded bg-purple py-3 text-sm font-medium text-white cursor-pointer hover:bg-purple-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all enabled:active:scale-95"
        :disabled="!isFormValid"
      >
        Sign Up
      </button>
    </form>

    <div class="mt-4 flex gap-1 text-text-primary">
      <p>Have an account?</p>
      <router-link to="/login" class="cursor-pointer text-purple-light hover:text-purple underline">
        Log in
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Form state
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

// Validation
const isEmailValid = computed(() => email.value.includes('@'))
const isPasswordValid = computed(() => password.value.length >= 6)
const doPasswordsMatch = computed(() => password.value === confirmPassword.value)
const isFormValid = computed(
  () => isEmailValid.value && isPasswordValid.value && doPasswordsMatch.value && email.value,
)

const onSubmit = () => {
  console.log('Form submitted:', {
    email: email.value,
    password: password.value,
  })
}
</script>
