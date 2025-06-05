<template>
  <button
    type="button"
    class="text-2xl font-bold text-white cursor-pointer"
    @click="$emit('navigateHome')"
  >
    POLYSITHS
  </button>
</template>

<script setup lang="ts">
defineEmits<{ (e: 'navigateHome'): void }>()
</script>
