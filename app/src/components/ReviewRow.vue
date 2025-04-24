<template></template>

<script setup lang="ts">
import { defineProps } from 'vue'

// Note: Reverse means that the row moves from left to right. Regular direction of scroll should be from right to left.
const props = defineProps<{ Reverse: boolean }>()
</script>
