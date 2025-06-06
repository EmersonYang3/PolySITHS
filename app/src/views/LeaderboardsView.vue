<template>
  <div class="min-h-screen bg-pure-black text-text-primary">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <SortButtons v-model:sortBy="sortBy" />

      <LeaderboardList
        :entries="currentEntries"
        :sort-by="sortBy"
        :loading="loading"
        @refresh="refreshData"
      />

      <div class="text-center mt-8 text-text-secondary text-sm">
        Last updated: {{ lastUpdated }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useLeaderBoardStore } from '@/stores/leaderboard'

import SortButtons from '@/components/Leaderboard/SortButtons.vue'
import LeaderboardList from '@/components/Leaderboard/LeaderboardList.vue'

const sortBy = ref<'wager' | 'win' | 'loss'>('wager')
const loading = ref(false)
const lastUpdated = ref(new Date().toLocaleDateString())

const store = useLeaderBoardStore()

const currentEntries = computed(() => {
  if (sortBy.value === 'wager') return store.wagerLeaderboard
  if (sortBy.value === 'win') return store.winLeaderboard
  return store.lossLeaderboard
})

async function loadAllLeaderboards() {
  loading.value = true
  await Promise.all([
    store.loadWagerLeaderboard(),
    store.loadWinLeaderboard(),
    store.loadLossLeaderboard(),
  ])
  loading.value = false
  lastUpdated.value = new Date().toLocaleDateString()
}

async function refreshData() {
  loading.value = true
  if (sortBy.value === 'wager') {
    await store.loadWagerLeaderboard()
  } else if (sortBy.value === 'win') {
    await store.loadWinLeaderboard()
  } else {
    await store.loadLossLeaderboard()
  }
  loading.value = false
  lastUpdated.value = new Date().toLocaleDateString()
}

onMounted(async () => {
  await loadAllLeaderboards()
})
</script>
