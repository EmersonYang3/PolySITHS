<template></template>

<script setup lang="ts">
import type { Market } from '@/utils/Types'
import { defineProps } from 'vue'

const props = defineProps<{ market: Market }>()

console.log(props.market)
</script>