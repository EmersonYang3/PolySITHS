<template>
  <div
    class="bg-pure-black border border-border rounded-xl overflow-hidden min-h-[600px]"
    style="box-shadow: 0 0 15px rgba(139, 92, 246, 0.15)"
  >
    <div class="px-6 py-4 border-b border-border bg-pure-black">
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
            <RefreshCw :class="['w-4 h-4 cursor-pointer', loading ? 'animate-spin' : '']" />
            <span class="sr-only">Refresh</span>
          </button>
        </div>
      </div>
    </div>

    <div>
      <template v-if="entries && entries.length">
        <div class="divide-y divide-border">
          <LeaderboardEntry
            v-for="(entry, idx) in entries"
            :key="entry.prediction_id || entry.id || entry.user_id"
            :entry="entry"
            :index="idx"
            :sort-by="sortBy"
          />
        </div>
      </template>
      <template v-else>
        <div class="py-6 text-center text-text-secondary">no users available</div>
      </template>
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
    validator: (val) => ['wager', 'win', 'loss', 'balance'].includes(val),
    required: true,
  },
  loading: Boolean,
})

defineEmits(['refresh'])

const headerIconColor = computed(() => {
  if (props.sortBy === 'wager') return 'text-purple-light'
  if (props.sortBy === 'win') return 'text-success'
  if (props.sortBy === 'loss') return 'text-error'
  return 'text-yellow-300'
})

const headerLabel = computed(() => {
  return props.sortBy === 'wager'
    ? 'Biggest Wager'
    : props.sortBy === 'win'
      ? 'Biggest Win'
      : props.sortBy === 'loss'
        ? 'Biggest Loss'
        : 'Highest Balance'
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
