<template>
  <div
    class="bg-gradient-to-r from-soft-black to-off-black p-4 rounded-lg border-l-4 border-purple animate-fadeIn shadow-lg"
  >
    <div class="mb-4">
      <div class="flex justify-between items-center mb-3">
        <span class="text-sm text-text-secondary">Investment Amount</span>
        <div class="flex items-center gap-2">
          <span class="text-text-secondary text-sm">$</span>
          <input
            type="number"
            v-model.number="amount"
            :max="maxAmount"
            min="0"
            step="1"
            class="w-20 h-8 text-right bg-off-black border border-border-light text-text-primary focus:border-purple focus:ring-1 focus:ring-purple focus:outline-none rounded px-2"
          />
        </div>
      </div>
      <input
        type="range"
        v-model.number="amount"
        :max="maxAmount"
        min="0"
        step="1"
        class="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
        :style="sliderStyle"
      />
    </div>

    <div class="grid grid-cols-3 gap-2 mb-4">
      <button
        v-for="btn in buttons"
        :key="btn.value"
        @click="increment(btn.value)"
        class="text-text-primary transition-all duration-200 font-medium flex items-center justify-center gap-1 px-3 py-2 rounded text-sm cursor-pointer active:scale-98 hover:scale-102"
        :class="btn.color"
      >
        <component :is="btn.value > 0 ? 'Plus' : 'span'">
          <template v-if="btn.value < 0">-</template>
          <template v-else>+</template>
        </component>
        ${{ Math.abs(btn.value).toLocaleString() }}
      </button>
    </div>

    <button
      @click="predict"
      :disabled="amount === 0"
      class="w-full bg-gradient-to-r from-purple to-purple-dark hover:from-purple-dark hover:to-purple-700 text-white font-medium py-3 transition-all duration-200 shadow-lg hover:shadow-xl rounded-lg flex items-center justify-center gap-2 cursor-pointer enabled:hover:scale-102 enabled:active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Predict!
      <span class="text-xs bg-white/20 px-2 py-1 rounded">${{ amount.toLocaleString() }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const props = defineProps<{ marketId: string; optionId: string }>()
const emit = defineEmits<{
  (e: 'predict', payload: { market_id: string; option_id: string; wager: number }): void
}>()

const userStore = useUserStore()
const maxAmount = computed(() => userStore.userData?.balance || 0)
const amount = ref(0)

watch(amount, (val) => {
  let corrected = Math.floor(val)
  if (corrected < 0) corrected = 0
  if (corrected > maxAmount.value) corrected = maxAmount.value
  if (corrected !== val) amount.value = corrected
})

const sliderStyle = computed(() => {
  const percent = maxAmount.value === 0 ? 0 : (amount.value / maxAmount.value) * 100
  return {
    background: `linear-gradient(to right, var(--color-purple) 0%, var(--color-purple) ${percent}%, var(--color-border-light) ${percent}%, var(--color-border-light) 100%)`,
  }
})

const buttons = [
  { value: 1, color: 'bg-info hover:bg-info-dark' },
  { value: 5, color: 'bg-success hover:bg-success-dark' },
  { value: 20, color: 'bg-warning hover:bg-warning-dark' },
  { value: 50, color: 'bg-purple hover:bg-purple-dark' },
  { value: 100, color: 'bg-error hover:bg-error-dark' },
  { value: -10, color: 'bg-text-muted hover:bg-gray-700' },
]

function increment(val: number) {
  amount.value = Math.max(0, Math.min(amount.value + val, maxAmount.value))
}

function predict() {
  if (amount.value === 0) return

  emit('predict', {
    market_id: props.marketId,
    option_id: props.optionId,
    wager: amount.value,
  })
  amount.value = 0
}
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: var(--color-purple);
  cursor: pointer;
  border: 2px solid #000;
}
.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: var(--color-purple);
  cursor: pointer;
  border: 2px solid #000;
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
