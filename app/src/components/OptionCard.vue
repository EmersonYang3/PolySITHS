<template>
  <div @click="select" :class="[base, selected ? selectedClass : unselectedClass]">
    <div class="flex justify-between items-center mb-3">
      <h3 class="font-medium text-text-primary">{{ option.name }}</h3>
      <span class="text-purple font-medium">{{ option.percentage }}%</span>
    </div>

    <div class="grid grid-cols-2 gap-3 text-sm text-text-secondary">
      <div>Volume: ${{ option.volume.toLocaleString() }}</div>
      <div>Shares: {{ option.shares.toLocaleString() }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OptionStats } from '@/utils/Types'

const props = defineProps<{ option: OptionStats; selected: boolean }>()

const emit = defineEmits<{
  (e: 'select', id: string): void
}>()

function select() {
  emit('select', props.option.id)
}

const base = 'p-4 rounded-lg cursor-pointer transition-all duration-200 border'
const selectedClass = 'bg-soft-black border-purple shadow-lg'
const unselectedClass = 'bg-off-black border-border-light hover:bg-soft-black'
</script>
