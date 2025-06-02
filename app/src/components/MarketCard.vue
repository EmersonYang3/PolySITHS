<template>
  <div class="text-white p-3">
    <p>Title: {{ market.title }}</p>
    <p>Description: {{ market.question }}</p>

    <p>Option 1 title: {{ market.options.Option1 }}</p>
    <p>Option 2 title: {{ market.options.Option2 }}</p>

    <p>Total Shares: {{ agregatedData.totalShares }}</p>
    <p>Volume: ${{ agregatedData.volume }}</p>

    <p>
      Option 1: {{ agregatedData.option1.shares }} shares, ${{ agregatedData.option1.volume }}
      volume
    </p>

    <p>
      Option 2: {{ agregatedData.option2.shares }} shares, ${{ agregatedData.option2.volume }}
      volume
    </p>

    <p>Projected Outcome: {{ new Date(market.projected_end) }}</p>

    <p>Time Until End: {{ new Date(market.projected_end).getTime() - new Date().getTime() }}</p>

    <p>
      {{ new Date(market.projected_end).getTime() - new Date().getTime() > 0 ? 'OPEN' : 'CLOSED' }}
    </p>

    <button
      class="cursor-pointer border p-2 transition-all active:scale-90 hover:scale-105"
      @click="NavToMarket"
    >
      Trade/View Chart
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Market } from '@/utils/Types'
import { defineProps, ref, onMounted } from 'vue'

const props = defineProps<{ market: Market }>()
const isLoading = ref<boolean>(false)

const agregatedData = ref({
  volume: 0,
  totalShares: 0,
  option1: { volume: 0, shares: 0 },
  option2: { volume: 0, shares: 0 },
})

console.log(props.market)

onMounted(() => {
  isLoading.value = true

  console.log(props.market.shares)

  props.market.shares.Option1.forEach((Option1Share) => {
    agregatedData.value.option1.volume += Option1Share.BoughtValue
    agregatedData.value.option1.shares += 1

    agregatedData.value.volume += Option1Share.BoughtValue
    agregatedData.value.totalShares += 1
  })

  props.market.shares.Option2.forEach((Option2Share) => {
    agregatedData.value.option2.volume += Option2Share.BoughtValue
    agregatedData.value.option2.shares += 1

    agregatedData.value.volume += Option2Share.BoughtValue
    agregatedData.value.totalShares += 1
  })

  console.log(agregatedData.value)
  isLoading.value = false
})

function NavToMarket() {
  console.log(props.market.marketid)
}
</script>
