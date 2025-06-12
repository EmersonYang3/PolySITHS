<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex flex-col lg:flex-row gap-4 items-start">
      <div class="flex-[3] w-full overflow-hidden">
        <div class="w-full h-full lg:h-[800px] relative">
          <MarketHistoryChart
            v-if="market.market_id"
            :marketId="market.market_id"
            :key="chartKey"
          />
        </div>
      </div>

      <div class="flex-[1] w-full lg:max-w-sm flex-shrink-0">
        <div
          class="bg-off-black border border-border-light shadow-lg rounded-lg overflow-hidden sticky top-4"
        >
          <div class="p-6 pb-4 flex items-center gap-3">
            <div class="p-2 bg-warning rounded-lg">
              <BarChart3 class="h-5 w-5 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-xl font-semibold text-text-primary w-full">
                {{ market.title }}
              </h2>
              <p class="text-text-secondary text-sm mt-1 line-clamp-2">
                {{ market.question }}
              </p>
            </div>
          </div>

          <div v-if="market.options.length" class="p-6 pt-0 space-y-3">
            <OptionCard
              v-for="opt in market.options"
              :key="opt.id"
              :option="opt"
              :selected="selected === opt.id"
              @select="handleSelect"
            />
            <PredictorPanel
              v-if="selected"
              :marketId="market.market_id"
              :optionId="selected"
              @predict="handlePredict"
            />
          </div>

          <div v-else class="p-6 text-center text-text-secondary">Loading...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { BarChart3 } from 'lucide-vue-next'

import { useMarketStore } from '@/stores/market'
import { usePredictionStore } from '@/stores/prediction'

import OptionCard from '@/components/OptionCard.vue'
import PredictorPanel from '@/components/PredictorPanel.vue'
import MarketHistoryChart from '@/components/MarketHistoryChart.vue'

import type { MarketWithStats } from '@/utils/Types'

const route = useRoute()
const marketStore = useMarketStore()
const predictionStore = usePredictionStore()

const market = ref<MarketWithStats>({
  market_id: '',
  title: '',
  question: '',
  creator_id: '',
  resolver_id: '',
  end_time: '',
  created_at: '',
  total_volume: 0,
  total_shares: 0,
  options: [],
})

const selected = ref<string | null>(null)
const chartKey = ref(0)

let resizeTimeout: number | null = null

function handleSelect(id: string) {
  selected.value = selected.value === id ? null : id
}

async function handlePredict(payload: { market_id: string; option_id: string; wager: number }) {
  await predictionStore.placePrediction(payload.market_id, payload.option_id, payload.wager)
}

function handleResize() {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
  resizeTimeout = window.setTimeout(() => {
    chartKey.value += 1
  }, 150)
}

onMounted(async () => {
  const id = route.params.id as string
  const result = await marketStore.fetchMarketById(id)
  if (result) market.value = result

  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
