<template>
  <div
    class="bg-off-black p-6 rounded-xl border border-border hover:border-border-light transition-all"
  >
    <div class="flex items-center gap-3 mb-4">
      <slot name="icon" />
      <h3 class="text-lg font-medium text-text-primary">{{ title }}</h3>
    </div>

    <template v-if="value !== null && value !== undefined">
      <p :class="['text-2xl font-bold', statusColorClass]">$ {{ formattedValue }}</p>
      <p v-if="date" class="text-text-secondary text-sm mt-2">
        {{ formattedDate }}
      </p>
    </template>

    <template v-else>
      <p class="text-text-secondary italic">No data available</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDate, formatBalance } from '@/utils/formatters'

const props = defineProps<{
  title: string
  value: number | null
  date: string | null
  status: 'win' | 'loss' | 'pending'
}>()

const statusColorClass = computed(() => {
  switch (props.status) {
    case 'win':
      return 'text-success'
    case 'loss':
      return 'text-error'
    default:
      return 'text-purple'
  }
})

const formattedValue = computed(() => formatBalance(props.value ?? 0))

const formattedDate = computed(() => (props.date ? formatDate(props.date) : ''))
</script>
