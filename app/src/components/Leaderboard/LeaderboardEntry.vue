<template>
  <div
    :class="[
      'px-6 py-4 hover:bg-soft-black/30 transition-all duration-300 ease-in-out transform',
      borderClass,
    ]"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4 cursor-pointer" @click="onClickProfile">
        <div :class="rankBadgeClass">
          <span class="text-sm font-semibold">{{ index + 1 }}</span>
        </div>

        <div :class="['w-10 h-10 rounded-full flex items-center justify-center', avatarBgClass]">
          <template v-if="user.profile_url">
            <img
              :src="user.profile_url"
              alt="avatar"
              class="w-full h-full object-cover rounded-full"
            />
          </template>
          <template v-else>
            <span class="text-sm font-bold text-pure-white">
              {{ user.display_name.charAt(0).toUpperCase() }}
            </span>
          </template>
        </div>

        <div>
          <div class="font-medium text-text-primary">{{ user.display_name }}</div>
          <div class="text-sm text-text-secondary">Player #{{ user.user_id }}</div>
        </div>
      </div>

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

<script setup lang="ts">
import { computed, defineEmits } from 'vue'
import { Trophy } from 'lucide-vue-next'

const props = defineProps<{
  entry: any
  index: number
  sortBy: 'wager' | 'win' | 'loss' | 'balance'
}>()

const emit = defineEmits<{
  (e: 'visitProfile', userId: string): void
}>()

// pick user object
const user = computed(() => (props.sortBy === 'balance' ? props.entry : props.entry.user_data))

function onClickProfile() {
  emit('visitProfile', user.value.user_id)
}

const statValue = computed(() => {
  if (props.sortBy === 'wager') return props.entry.wager
  if (props.sortBy === 'win') return props.entry.win ?? 0
  if (props.sortBy === 'loss') return props.entry.win ?? 0
  return user.value.balance ?? 0
})

const statLabel = computed(() => props.sortBy.charAt(0).toUpperCase() + props.sortBy.slice(1))

const formatCurrency = (amount: number) =>
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
  return `${base} bg-border-light/40 text-text-secondary border-border`
})

const avatarBgClass = computed(() => {
  if (props.sortBy === 'wager') return 'bg-gradient-to-br from-purple to-purple-dark'
  if (props.sortBy === 'win') return 'bg-gradient-to-br from-success to-success-dark'
  if (props.sortBy === 'loss') return 'bg-gradient-to-br from-error to-error-dark'
  return 'bg-gradient-to-br from-yellow-300 to-yellow-500'
})

const statValueClass = computed(() => {
  if (props.sortBy === 'win') return 'text-success'
  if (props.sortBy === 'loss') return 'text-error'
  if (props.sortBy === 'balance') return 'text-yellow-300'
  return 'text-purple-light'
})

const trophyClass = computed(() => {
  if (props.index === 0) return 'text-warning'
  if (props.index === 1) return 'text-text-secondary'
  return 'text-warning-dark'
})
</script>
