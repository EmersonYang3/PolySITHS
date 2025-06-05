<template></template>

<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMarketStore } from '@/stores/prediction'

const route = useRoute()
const marketStore = useMarketStore()

onMounted(async () => {
  console.log('WHJAT THE SIGMS')
  const id = route.params.id as string

  console.log(marketStore.selectedMarket)
})

/* const market = computed(() => marketStore.selectedMarket)

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString()
} */
</script>
