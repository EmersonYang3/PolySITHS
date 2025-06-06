<template>
  <div
    class="bg-soft-black border border-border rounded-xl overflow-hidden min-h-[600px]"
    style="box-shadow: 0 0 15px rgba(139, 92, 246, 0.15)"
  >
    <!-- Header -->
    <div class="px-6 py-4 border-b border-border bg-soft-black">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold flex items-center gap-2 text-text-primary">
          <Trophy :class="['w-5 h-5', headerIconColor]" />
          Top Players
        </h2>
        <div class="flex items-center gap-4">
          <div class="text-sm text-text-secondary">Sorted by {{ headerLabel }}</div>
          <button
            @click="$emit('refresh')"
            :disabled="loading"
            class="flex items-center justify-center w-8 h-8 rounded-full bg-border hover:bg-border-light transition-colors duration-200 text-text-secondary hover:text-text-primary disabled:opacity-50"
          >
            <RefreshCw :class="['w-4 h-4', loading ? 'animate-spin' : '']" />
            <span class="sr-only">Refresh</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Entries -->
    <div class="divide-y divide-border">
      <LeaderboardEntry
        v-for="(entry, idx) in entries"
        :key="entry.prediction_id || entry.id"
        :entry="entry"
        :index="idx"
        :sort-by="sortBy"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import LeaderboardEntry from './LeaderboardEntry.vue'
import { Trophy, RefreshCw } from 'lucide-vue-next'

const props = defineProps({
  entries: Array,
  sortBy: {
    type: String,
    validator: (val) => ['wager', 'win', 'loss'].includes(val),
    required: true,
  },
  loading: Boolean,
})

defineEmits(['refresh'])

const headerIconColor = computed(() => {
  if (props.sortBy === 'wager') return 'text-purple'
  if (props.sortBy === 'win') return 'text-success'
  return 'text-error'
})

const headerLabel = computed(() => {
  return props.sortBy === 'wager'
    ? 'Biggest Wager'
    : props.sortBy === 'win'
      ? 'Biggest Win'
      : 'Biggest Loss'
})
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
