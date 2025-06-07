<template>
  <div class="flex flex-wrap justify-center gap-4 mb-8">
    <button
      @click="$emit('update:sortBy', 'wager')"
      class="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 cursor-pointer"
      :class="
        sortBy === 'wager'
          ? 'bg-purple-600 text-white border border-purple-400'
          : 'bg-black text-gray-300 border border-purple-900 hover:border-purple-700 hover:text-white'
      "
    >
      <DollarSign
        :class="['w-4 h-4', sortBy === 'wager' ? 'text-purple-300' : 'text-purple-500']"
      />
      Biggest Wager
    </button>

    <button
      @click="$emit('update:sortBy', 'win')"
      class="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 cursor-pointer"
      :class="
        sortBy === 'win'
          ? 'bg-green-700 text-white border border-green-500'
          : 'bg-black text-gray-300 border border-green-900 hover:border-green-700 hover:text-white'
      "
    >
      <TrendingUp :class="['w-4 h-4', sortBy === 'win' ? 'text-green-300' : 'text-green-500']" />
      Biggest Win
    </button>

    <button
      @click="$emit('update:sortBy', 'loss')"
      class="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 cursor-pointer"
      :class="
        sortBy === 'loss'
          ? 'bg-red-700 text-white border border-red-500'
          : 'bg-black text-gray-300 border border-red-900 hover:border-red-700 hover:text-white'
      "
    >
      <TrendingDown :class="['w-4 h-4', sortBy === 'loss' ? 'text-red-300' : 'text-red-500']" />
      Biggest Loss
    </button>

    <button
      @click="$emit('update:sortBy', 'balance')"
      class="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 cursor-pointer"
      :class="
        sortBy === 'balance'
          ? 'bg-yellow-500 text-white border border-yellow-300'
          : 'bg-black text-gray-300 border border-amber-700 hover:border-amber-300hover:text-white'
      "
    >
      <Wallet
        class="w-4 h-4"
        :class="sortBy === 'balance' ? ' text-amber-700' : 'text-yellow-500'"
      />
      Highest Balance
    </button>
  </div>
</template>

<script setup lang="ts">
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-vue-next'
defineProps<{ sortBy: 'wager' | 'win' | 'loss' | 'balance' }>()
defineEmits(['update:sortBy'])
</script>
