<template>
  <div class="flex flex-wrap gap-4 bg-pure-black items-center justify-center p-4">
    <MarketCard v-for="market in markets" :market="market" />
  </div>
</template>

<script setup lang="ts">
import { useMarketStore } from '@/stores/market'
import MarketCard from './MarketCard.vue'
import { onMounted, computed } from 'vue'

const marketStore = useMarketStore()
const markets = computed(() => marketStore.marketsWithAggregates)

onMounted(async () => {
  await marketStore.refreshMarkets()
})
</script>
