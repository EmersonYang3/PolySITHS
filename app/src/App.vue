<template>
  <div :style="{ height: bodyHeight + 'px' }" />

  <GlobalNav />

  <div
    ref="contentRef"
    class="fixed top-0 left-0 w-full bg-pure-black pt-16"
    :style="{ transform: `translateY(${transformY}px)` }"
  >
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import GlobalNav from './components/GlobalNav/GlobalNav.vue'

function springLerp(current: number, target: number, stiffness = 0.15) {
  return current + (target - current) * stiffness
}

const contentRef = ref<HTMLElement | null>(null)
const bodyHeight = ref(0)
const transformY = ref(0)

let targetScrollY = 0
let currentScrollY = 0
let rafId: number | null = null

let resizeFrame: number | null = null

const route = useRoute()

function updateHeight() {
  if (contentRef.value) {
    const rect = contentRef.value.getBoundingClientRect()
    bodyHeight.value = Math.max(rect.height, window.innerHeight)
  } else {
    bodyHeight.value = window.innerHeight
  }
}

function onResize() {
  if (resizeFrame !== null) {
    cancelAnimationFrame(resizeFrame)
  }
  resizeFrame = requestAnimationFrame(() => {
    updateHeight()
    resizeFrame = null
  })
}

function tick() {
  targetScrollY = window.scrollY || window.pageYOffset
  currentScrollY = springLerp(currentScrollY, targetScrollY)
  transformY.value = -currentScrollY
  rafId = requestAnimationFrame(tick)
}

watch(
  () => route.fullPath,
  () => {
    nextTick().then(updateHeight)
  }
)

onMounted(() => {
  nextTick().then(updateHeight)

  window.addEventListener('resize', onResize)

  rafId = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)

  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  if (resizeFrame !== null) {
    cancelAnimationFrame(resizeFrame)
    resizeFrame = null
  }
})
</script>
