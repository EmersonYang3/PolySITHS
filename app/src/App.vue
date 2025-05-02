<script setup lang="ts">
import GlobalNav from './components/GlobalNav.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="bg-pure-black h-screen w-screen">
    <GlobalNav />
    <RouterView />
  </div>
</template>
