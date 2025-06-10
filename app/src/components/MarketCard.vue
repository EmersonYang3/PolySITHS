<template>
  <div
    class="bg-off-black border border-border-light rounded-lg p-3 w-full hover:border-purple transition-colors h-fit"
  >
    <div class="mb-3 h-12">
      <h3 class="text-white font-semibold text-sm mb-1 line-clamp-2 leading-tight">
        {{ market.title }}
      </h3>
      <p class="text-gray-400 text-xs line-clamp-1">{{ market.question }}</p>
    </div>

    <div class="mb-3 h-22">
      <div class="h-full overflow-y-auto scrollbar-hide space-y-1">
        <div
          v-for="option in sortedOptions"
          :key="option.id"
          class="flex items-center justify-between py-1 px-2 bg-soft-black rounded border border-border hover:border-purple-dark transition-colors"
        >
          <div class="flex items-center gap-2 flex-1 min-w-0">
            <div
              class="w-1 h-4 rounded-sm bg-purple"
              :style="{ opacity: option.percentage / 100 }"
            />
            <span class="text-white text-xs font-medium truncate">{{ option.name }}</span>
          </div>
          <div class="flex items-center gap-2 min-w-[120px] justify-end">
            <div class="flex items-center gap-1">
              <div class="w-8 bg-border-light rounded-full h-1 overflow-hidden">
                <div
                  class="h-full bg-purple rounded-full transition-all duration-300"
                  :style="{ width: option.percentage + '%' }"
                />
              </div>
              <span class="text-purple text-xs font-bold min-w-[32px]"
                >{{ option.percentage.toFixed(1) }}%</span
              >
            </div>
            <div class="flex flex-col text-xs text-right min-w-[64px]">
              <span class="text-green-400">{{ formatCurrency(option.volume) }}</span>
              <span class="text-amber-300">{{ formatNumber(option.shares) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex items-center justify-between mb-3 py-2 px-3 bg-soft-black rounded border border-border h-10"
    >
      <div class="flex items-center gap-2">
        <TrendingUpIcon class="w-3 h-3 text-green-400" />
        <span class="text-xs text-gray-300">Vol:</span>
        <span class="text-xs text-green-400 font-medium">{{
          formatCurrency(market.total_volume)
        }}</span>
      </div>
      <div class="flex items-center gap-2">
        <UsersIcon class="w-3 h-3 text-amber-300" />
        <span class="text-xs text-gray-300">Shares:</span>
        <span class="text-xs text-amber-300 font-medium">{{
          formatNumber(market.total_shares)
        }}</span>
      </div>
    </div>

    <div
      class="flex items-center justify-between mb-3 py-2 px-3 bg-soft-black rounded border border-border h-10"
    >
      <div class="flex items-center gap-2">
        <ClockIcon class="w-3 h-3 text-purple" />
        <span class="text-gray-300 text-xs">Closes:</span>
      </div>
      <div class="flex gap-1 text-white font-mono text-xs">
        <span class="bg-purple-dark px-1.5 py-0.5 rounded">{{ timeLeft.days }}d</span>
        <span class="bg-purple-dark px-1.5 py-0.5 rounded">{{ timeLeft.hours }}h</span>
        <span class="bg-purple-dark px-1.5 py-0.5 rounded">{{ timeLeft.minutes }}m</span>
        <span class="bg-purple-dark px-1.5 py-0.5 rounded">{{ timeLeft.seconds }}s</span>
      </div>
    </div>

    <button
      class="w-full bg-gradient-to-r from-purple to-purple-dark hover:from-purple-dark hover:to-purple text-white font-medium py-2 px-3 rounded text-xs transition-all duration-300 mb-3 h-8 border border-purple-light hover:border-purple-300 hover:shadow-[0_0_10px_rgba(139,92,246,0.4)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
      @click="visitMarket"
    >
      <BarChart3Icon class="w-3 h-3" />
      Buy/View Market
    </button>

    <div class="flex items-center justify-between text-xs py-1 border-t border-border h-6">
      <div class="flex items-center gap-1 text-gray-400">
        <UserIcon class="w-3 h-3 text-purple-light" />
        <button class="text-white cursor-pointer" @click="visitProfile(market.creator_id)">
          {{ market.creator_id.slice(0, 4) }}…
        </button>
      </div>
      <div class="flex items-center gap-1 text-gray-400">
        <ShieldIcon class="w-3 h-3 text-purple-light" />
        <button class="text-white cursor-pointer" @click="visitProfile(market.resolver_id)">
          {{ market.resolver_id.slice(0, 4) }}…
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, reactive, onMounted, onUnmounted, computed, defineEmits } from 'vue'
import type { MarketWithStats } from '@/utils/Types'
import {
  ClockIcon,
  UserIcon,
  ShieldIcon,
  TrendingUpIcon,
  UsersIcon,
  BarChart3Icon,
} from 'lucide-vue-next'

type Market = MarketWithStats
const props = defineProps<{ market: Market }>()

const emits = defineEmits<{
  (e: 'visitMarket', id: string): void
  (e: 'visitProfile', id: string): void
}>()

function visitMarket() {
  emits('visitMarket', props.market.market_id)
}

function visitProfile(userId: string) {
  emits('visitProfile', userId)
}

const sortedOptions = computed(() => {
  return [...props.market.options].sort((a, b) => b.percentage - a.percentage)
})

const timeLeft = reactive({ days: 0, hours: 0, minutes: 0, seconds: 0 })
let timer: ReturnType<typeof setInterval>

function calculateTimeLeft() {
  const now = Date.now()
  const end = new Date(props.market.end_time).getTime()
  const diff = Math.max(0, end - now)
  const secs = Math.floor(diff / 1000) % 60
  const mins = Math.floor(diff / (1000 * 60)) % 60
  const hrs = Math.floor(diff / (1000 * 60 * 60)) % 24
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  timeLeft.days = days
  timeLeft.hours = hrs
  timeLeft.minutes = mins
  timeLeft.seconds = secs
}

onMounted(() => {
  calculateTimeLeft()
  timer = setInterval(calculateTimeLeft, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const formatCurrency = (value: number): string => {
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`
  return `$${value.toFixed(0)}`
}

const formatNumber = (value: number): string => {
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`
  return `${value}`
}
</script>
