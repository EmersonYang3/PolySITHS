<template>
  <div v-for="market in markets" class="flex flex-col gap-4">
    <MarketCard :market="market" />
  </div>
</template>

<script setup lang="ts">
import { useMarketStore } from '@/stores/market'
import MarketCard from './MarketCard.vue'
import { onMounted, computed } from 'vue'

const marketStore = useMarketStore()
const markets = computed(() => marketStore.availableMarkets)

onMounted(async () => {
  await marketStore.refreshMarkets()
})
</script>
