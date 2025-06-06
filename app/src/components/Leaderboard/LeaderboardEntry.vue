<template>
  <div
    :class="[
      'px-6 py-4 hover:bg-soft-black/30 transition-all duration-300 ease-in-out transform',
      borderClass,
    ]"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <!-- Rank Badge -->
        <div :class="rankBadgeClass">
          <span class="text-sm font-semibold">{{ index + 1 }}</span>
        </div>

        <!-- Avatar or Initial -->
        <div :class="['w-10 h-10 rounded-full flex items-center justify-center', avatarBgClass]">
          <template v-if="entry.user_data.profile_url">
            <img
              :src="entry.user_data.profile_url"
              alt="avatar"
              class="w-full h-full object-cover rounded-full"
            />
          </template>
          <template v-else>
            <span class="text-sm font-bold text-pure-white">
              {{ entry.user_data.display_name.charAt(0).toUpperCase() }}
            </span>
          </template>
        </div>

        <!-- Username + ID -->
        <div>
          <div class="font-medium text-text-primary">{{ entry.user_data.display_name }}</div>
          <div class="text-sm text-text-secondary">
            Player #{{ entry.user_data.user_id.slice(0, 8) }}
          </div>
        </div>
      </div>

      <!-- Stat & Trophy -->
      <div class="flex items-center gap-8">
        <div class="text-right">
          <div class="text-sm text-text-secondary mb-1">
            {{ statLabel }}
          </div>
          <div :class="['font-bold text-lg', statValueClass]">
            {{ formatCurrency(statValue) }}
          </div>
        </div>
        <div v-if="index < 3" :class="['w-6 h-6', trophyClass]">
          <Trophy class="w-full h-full" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Trophy } from 'lucide-vue-next'

const props = defineProps({
  entry: Object,
  index: Number,
  sortBy: {
    type: String,
    validator: (val) => ['wager', 'win', 'loss'].includes(val),
  },
})

const statValue = computed(() => {
  if (props.sortBy === 'wager') return props.entry.wager
  return props.entry.win ?? 0
})

const statLabel = computed(() => {
  return props.sortBy === 'wager'
    ? 'Biggest Wager'
    : props.sortBy === 'win'
      ? 'Biggest Win'
      : 'Biggest Loss'
})

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

const borderClass = computed(() => {
  if (props.index === 0) return 'border-l-4 border-warning'
  if (props.index === 1) return 'border-l-4 border-text-secondary'
  if (props.index === 2) return 'border-l-4 border-warning-dark'
  return ''
})

const rankBadgeClass = computed(() => {
  const base = 'flex items-center justify-center w-8 h-8 rounded-full border text-sm font-semibold'
  if (props.index === 0) return `${base} bg-warning/20 text-warning border-warning`
  if (props.index === 1)
    return `${base} bg-text-secondary/20 text-text-secondary border-text-secondary`
  if (props.index === 2) return `${base} bg-warning-dark/20 text-warning-dark border-warning-dark`
  return `${base} bg-border-light text-text-secondary border-border`
})

const avatarBgClass = computed(() => {
  if (props.sortBy === 'wager') return 'bg-purple'
  if (props.sortBy === 'win') return 'bg-success'
  return 'bg-error'
})

const statValueClass = computed(() => {
  if (props.sortBy === 'win') return 'text-success'
  if (props.sortBy === 'loss') return 'text-error'
  return 'text-purple'
})

const trophyClass = computed(() => {
  if (props.index === 0) return 'text-warning'
  if (props.index === 1) return 'text-text-secondary'
  return 'text-warning-dark'
})
</script>
