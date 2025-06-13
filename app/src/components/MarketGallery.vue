<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex justify-center mb-8">
      <SearchBar v-model:searchQuery="searchQuery" />
    </div>

    <div v-if="filteredMarkets.length === 0" class="text-center text-gray-500 mb-8">
      No markets available
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
      <MarketCard
        v-for="market in filteredMarkets"
        :key="market.market_id"
        :market="market"
        @visit-profile="visitProfile"
        @visit-market="visitMarket"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Fuse from 'fuse.js'
import type { FuseResult } from 'fuse.js'
import type { MarketWithStats } from '../utils/Types'

import { computed, ref, onUnmounted } from 'vue'
import { useMarketStore } from '@/stores/market'
import { useRouter } from 'vue-router'

import SearchBar from '@/components/SearchBar.vue'
import MarketCard from '@/components/MarketCard.vue'

const router = useRouter()
const marketStore = useMarketStore()
const searchQuery = ref('')

const fuse = computed(
  () =>
    new Fuse<MarketWithStats>(marketStore.marketList, {
      keys: ['title', 'question'],
      threshold: 0.4,
    }),
)

const filteredMarkets = computed<MarketWithStats[]>(() => {
  if (!searchQuery.value.trim()) {
    return marketStore.marketList
  }
  return fuse.value.search(searchQuery.value).map((res: FuseResult<MarketWithStats>) => res.item)
})

function visitProfile(userId: string) {
  router.push({ name: 'profile', params: { id: userId } })
}

function visitMarket(marketId: string) {
  router.push({ name: 'market', params: { id: marketId } })
}

marketStore.fetchMarketsWithStats()

onUnmounted(() => {
  marketStore.flushAll()
})
</script>
