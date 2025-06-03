<template>
  <div class="bg-soft-black border border-border rounded-lg p-3 w-full max-w-md">
    <div class="flex justify-between items-center mb-3">
      <div
        :class="`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
          market.status === 'open' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
        }`"
      >
        <Zap :size="8" />
        {{ market.status === 'open' ? 'OPEN' : 'CLOSED' }}
      </div>
      <div class="flex items-center gap-1 text-warning text-xs font-medium">
        <Clock :size="10" />
        {{ timeLeft }}
      </div>
    </div>

    <div class="mb-3">
      <div class="mb-3">
        <h3 class="text-text-primary text-lg font-bold mb-1">{{ market.title }}</h3>
        <p class="text-text-secondary text-xs leading-relaxed">{{ market.question }}</p>
      </div>

      <div class="space-y-2 mb-3">
        <!-- Option 1 -->
        <div class="bg-purple/10 p-2 rounded-lg">
          <div class="grid grid-cols-[1fr_60px_80px_80px] items-center gap-2">
            <span class="text-text-primary text-xs font-medium truncate">
              {{ market.options.Option1 }}
            </span>
            <span class="text-purple text-xs font-bold text-right">{{ option1Percentage }}%</span>
            <span class="text-purple text-xs font-bold text-right">
              ${{ formatNumber(market.aggregated.option1.volume) }}
            </span>
            <span class="text-purple text-xs font-bold text-right">
              {{ market.aggregated.option1.shares }} shares
            </span>
          </div>
        </div>

        <!-- Option 2 -->
        <div class="bg-purple-dark/10 p-2 rounded-lg">
          <div class="grid grid-cols-[1fr_60px_80px_80px] items-center gap-2">
            <span class="text-text-primary text-xs font-medium truncate">
              {{ market.options.Option2 }}
            </span>
            <span class="text-purple-dark text-xs font-bold text-right"
              >{{ option2Percentage }}%</span
            >
            <span class="text-purple-dark text-xs font-bold text-right">
              ${{ formatNumber(market.aggregated.option2.volume) }}
            </span>
            <span class="text-purple-dark text-xs font-bold text-right">
              {{ market.aggregated.option2.shares }} shares
            </span>
          </div>
        </div>
      </div>

      <div class="text-text-muted text-xs font-medium mb-3">
        Total: ${{ formatNumber(market.aggregated.volume) }} volume •
        {{ market.aggregated.totalShares }} shares
      </div>
    </div>

    <button
      class="w-full bg-gradient-to-r from-purple to-purple-dark hover:from-purple-light hover:to-purple text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 font-medium text-sm cursor-pointer hover:scale-102 active:scale-98"
      @click="goToMarket"
      @mouseenter="handleButtonHover"
      @mouseleave="handleButtonLeave"
    >
      <BarChart3 :size="14" />
      <span>Buy / View Chart</span>
      <div ref="arrowRef">
        <ArrowRight :size="14" />
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, BarChart3, Clock, Zap } from 'lucide-vue-next'
import gsap from 'gsap'
import type { MarketWithAggregated } from '@/utils/Types'

const props = defineProps<{
  market: MarketWithAggregated
}>()

const router = useRouter()
const arrowRef = ref<HTMLDivElement | null>(null)
const timeLeft = ref('')
let countdownInterval: number | null = null

const option1Percentage = computed(() => {
  return props.market.aggregated.volume === 0
    ? 50
    : Math.round((props.market.aggregated.option1.volume / props.market.aggregated.volume) * 100)
})

const option2Percentage = computed(() => {
  return 100 - option1Percentage.value
})

const updateCountdown = () => {
  const end = new Date(props.market.projected_end)
  const now = new Date()
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) {
    timeLeft.value = '0h 0m 0s'
    return
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  if (days > 0) {
    timeLeft.value = `${days}d ${hours}h ${minutes}m`
  } else if (hours > 0) {
    timeLeft.value = `${hours}h ${minutes}m ${seconds}s`
  } else {
    timeLeft.value = `${minutes}m ${seconds}s`
  }
}

const handleButtonHover = () => {
  if (arrowRef.value) {
    gsap.to(arrowRef.value, { x: 3, duration: 0.15, ease: 'power2.out' })
  }
}

const handleButtonLeave = () => {
  if (arrowRef.value) {
    gsap.to(arrowRef.value, { x: 0, duration: 0.15, ease: 'power2.out' })
  }
}

const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

const goToMarket = () => {
  router.push({ name: 'market', params: { id: props.market.marketid } })
}

onMounted(() => {
  updateCountdown()
  countdownInterval = window.setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (countdownInterval !== null) {
    clearInterval(countdownInterval)
  }
})
</script>
