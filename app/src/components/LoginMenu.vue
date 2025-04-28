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
        <input
          type="password"
          id="password"
          v-model="password"
          class="w-full rounded border border-border-light bg-black p-3 text-white focus:border-purple focus:outline-none"
          required
        />
      </div>

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

      <button
        type="submit"
        class="mt-4 w-full rounded bg-purple py-3 text-sm font-medium text-white cursor-pointer transition-all enabled:active:scale-95 hover:bg-purple-dark disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!isFormValid"
      >
        Log In
      </button>
    </form>

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

const email = ref('')
const password = ref('')
const rememberMe = ref(false)

const isEmailValid = computed(() => email.value.includes('@'))
const isFormValid = computed(() => isEmailValid.value && email.value && password.value)

const onSubmit = () => {
  console.log('Login submitted:', {
    email: email.value,
    password: password.value,
    rememberMe: rememberMe.value,
  })
}
</script>
