<template>
  <GlobalNav />
  <div class="pt-16 bg-pure-black min-h-screen">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import GlobalNav from './components/GlobalNav/GlobalNav.vue'
</script>
