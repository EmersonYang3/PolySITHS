<script setup lang="ts">
import GlobalNav from './components/GlobalNav.vue'
import { RouterView } from 'vue-router'

console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
</script>

<template>
  <div class="bg-pure-black h-screen w-screen">
    <GlobalNav />
    <RouterView />
  </div>
</template>
