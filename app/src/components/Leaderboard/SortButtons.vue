<template>
  <div class="flex flex-wrap justify-center gap-4 mb-8">
    <button
      @click="$emit('update:sortBy', 'wager')"
      class="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 cursor-pointer"
      :class="
        sortBy === 'wager'
          ? 'bg-purple text-pure-white border-2 border-purple-light'
          : 'bg-pure-black text-text-secondary border border-purple-dark hover:border-purple-light hover:text-text-primary'
      "
    >
      <DollarSign :class="['w-4 h-4', sortBy === 'wager' ? 'text-purple-light' : 'text-purple']" />
      Biggest Wager
    </button>

    <button
      @click="$emit('update:sortBy', 'win')"
      class="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 cursor-pointer"
      :class="
        sortBy === 'win'
          ? 'bg-success text-pure-white border-2 border-success-dark'
          : 'bg-pure-black text-text-secondary border border-success-dark hover:border-success hover:text-text-primary'
      "
    >
      <TrendingUp :class="['w-4 h-4', sortBy === 'win' ? 'text-success-dark' : 'text-success']" />
      Biggest Win
    </button>

    <button
      @click="$emit('update:sortBy', 'loss')"
      class="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 cursor-pointer"
      :class="
        sortBy === 'loss'
          ? 'bg-error text-pure-white border-2 border-error-dark'
          : 'bg-pure-black text-text-secondary border border-error-dark hover:border-error hover:text-text-primary'
      "
    >
      <TrendingDown :class="['w-4 h-4', sortBy === 'loss' ? 'text-error-dark' : 'text-error']" />
      Biggest Loss
    </button>
  </div>
</template>

<script setup lang="ts">
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-vue-next'
defineProps<{ sortBy: 'wager' | 'win' | 'loss' }>()
defineEmits(['update:sortBy'])
</script>
