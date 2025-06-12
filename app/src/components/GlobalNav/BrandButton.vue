<template>
  <button
    type="button"
    class="rainbow-text text-2xl font-bold cursor-pointer"
    @click="$emit('navigateHome')"
  >
    POLYSITHS
  </button>
</template>

<script setup lang="ts">
defineEmits<{ (e: 'navigateHome'): void }>()
</script>

<style scoped>
.rainbow-text {
  background: linear-gradient(
    90deg,
    #e60000,
    #ff8c00,
    #ffea00,
    #008026,
    #004dff,
    #750787
  );
  background-size: 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rainbow 5s linear infinite;
}

@keyframes rainbow {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>
