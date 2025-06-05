<template>
  <div
    class="flex items-center gap-2 px-3 py-1.5 rounded border border-border-light bg-soft-black hover:border-purple transition-all"
  >
    <span class="text-xs text-text-secondary">Balance:</span>
    <span class="text-sm font-semibold text-purple-light"> ${{ animatedBalance }} </span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { gsap } from 'gsap'

const props = defineProps<{ currentBalance: number }>()
const animatedBalance = ref('0')

watch(
  () => props.currentBalance,
  (newValue) => {
    const startingValue = parseInt(animatedBalance.value.replace(/,/g, ''), 10) || 0
    const tweenTarget = { value: startingValue }

    gsap.to(tweenTarget, {
      value: newValue,
      duration: 0.75,
      ease: 'power2.out',
      onUpdate: () => {
        animatedBalance.value = Math.floor(tweenTarget.value).toLocaleString()
      },
    })
  },

  { immediate: true },
)
</script>
