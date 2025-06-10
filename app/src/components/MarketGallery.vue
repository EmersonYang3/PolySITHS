<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <MarketCard
        v-for="market in marketStore.marketList"
        :key="market.market_id"
        :market="market"
        @visit-profile="visitProfile"
        @visit-market="visitMarket"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import MarketCard from '@/components/MarketCard.vue'
import { useMarketStore } from '@/stores/market'
import { onMounted } from 'vue'

import { useRouter } from 'vue-router'
const router = useRouter()

const marketStore = useMarketStore()

function visitProfile(userId: string) {
  router.push({ name: 'profile', params: { id: userId } })
}

function visitMarket(marketId: string) {
  router.push({ name: 'market', params: { id: marketId } })
}

onMounted(() => {
  marketStore.fetchMarketsWithStats()
})
</script>
