<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <StatCard title="Biggest Wager" :value="biggestWager" :date="biggestWagerDate" status="pending">
      <template #icon>
        <CircleDollarSign class="w-6 h-6 text-purple" />
      </template>
    </StatCard>

    <StatCard title="Biggest Win" :value="biggestWin" :date="biggestWinDate" status="win">
      <template #icon>
        <ArrowUpCircle class="w-6 h-6 text-success" />
      </template>
    </StatCard>

    <StatCard title="Biggest Loss" :value="biggestLoss" :date="biggestLossDate" status="loss">
      <template #icon>
        <ArrowDownCircle class="w-6 h-6 text-error" />
      </template>
    </StatCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePredictionStore } from '@/stores/prediction'

import StatCard from './StatCard.vue'
import { CircleDollarSign, ArrowUpCircle, ArrowDownCircle } from 'lucide-vue-next'

const props = defineProps<{ userId: string }>()

const store = usePredictionStore()
const loaded = ref(false)

onMounted(async () => {
  await store.loadPredictionExtremes(props.userId)
  loaded.value = true
})

onUnmounted(() => {
  store.flushAll()
})

const biggestWager = computed(() => (loaded.value ? (store.biggest_wager?.wager ?? null) : null))
const biggestWagerDate = computed(() =>
  loaded.value ? (store.biggest_wager?.created_at ?? null) : null,
)

const biggestWin = computed(() => (loaded.value ? (store.biggest_win?.win ?? null) : null))
const biggestWinDate = computed(() =>
  loaded.value ? (store.biggest_win?.created_at ?? null) : null,
)

const biggestLoss = computed(() => (loaded.value ? (store.biggest_loss?.wager ?? null) : null))
const biggestLossDate = computed(() =>
  loaded.value ? (store.biggest_loss?.created_at ?? null) : null,
)
</script>
