<template>
  <div class="min-h-screen bg-pure-black text-text-primary">
    <div class="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <SortButtons v-model:sortBy="sortBy" />

      <LeaderboardList
        :entries="currentEntries"
        :sort-by="sortBy"
        :loading="loading"
        @refresh="refreshData"
      />

      <div class="text-center text-sm text-text-secondary">Last updated: {{ lastUpdated }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useLeaderBoardStore } from '@/stores/leaderboard'
import SortButtons from '@/components/Leaderboard/SortButtons.vue'
import LeaderboardList from '@/components/Leaderboard/LeaderboardList.vue'

// --- State ---
const sortBy = ref<'wager' | 'win' | 'loss' | 'balance'>('wager')
const loading = ref(false)
const lastUpdated = ref(formatDate(new Date()))

const store = useLeaderBoardStore()

const currentEntries = computed(() => {
  switch (sortBy.value) {
    case 'wager':
      return store.wagerLeaderboard
    case 'win':
      return store.winLeaderboard
    case 'loss':
      return store.lossLeaderboard
    case 'balance':
      return store.balanceLeaderboard
  }
})

function formatDate(date: Date): string {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

async function loadAllLeaderboards() {
  loading.value = true
  await Promise.all([
    store.loadWagerLeaderboard(),
    store.loadWinLeaderboard(),
    store.loadLossLeaderboard(),
    store.loadBalanceLeaderboard(),
  ])
  loading.value = false
  lastUpdated.value = formatDate(new Date())
}

async function refreshData() {
  loading.value = true

  const loaderMap = {
    wager: store.loadWagerLeaderboard,
    win: store.loadWinLeaderboard,
    loss: store.loadLossLeaderboard,
    balance: store.loadBalanceLeaderboard,
  }

  await loaderMap[sortBy.value]()
  loading.value = false
  lastUpdated.value = formatDate(new Date())
}

onMounted(() => {
  loadAllLeaderboards()
})
</script>
