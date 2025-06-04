<template>
  <button
    type="button"
    class="h-9 rounded border border-border-light bg-soft-black px-3 text-sm font-medium text-text-primary hover:bg-soft-black hover:text-purple-light sm:px-4 cursor-pointer transition-all"
    @click="$emit('requestLogin')"
  >
    Log in
  </button>
  <button
    type="button"
    class="h-9 rounded bg-purple px-3 text-sm font-medium text-black hover:bg-purple-dark sm:px-4 cursor-pointer transition-all"
    @click="$emit('requestSignup')"
  >
    Sign up
  </button>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'

defineEmits<{
  (e: 'requestLogin'): void
  (e: 'requestSignup'): void
}>()
</script>
