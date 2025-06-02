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
// Lowkey have NO IDEA what I'm doing here, but it works so I guess it's fine
// Adding actual functionality? ❌ Making useless "cool" stuff that looks nice? ✅
// Roblox LERP my beloved... <3
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import GlobalNav from './components/GlobalNav.vue'

// Sring Lerp my beloved.... <3
function springLerp(current: number, target: number, stiffness = 0.15) {
  return current + (target - current) * stiffness
}

const contentRef = ref<HTMLElement | null>(null)
const bodyHeight = ref(0)
const transformY = ref(0)

let targetScrollY = 0
let currentScrollY = 0
let rafId: number | null = null

// Updating the body height so it works when the user navigates to a new page
const updateHeight = () => {
  if (contentRef.value) {
    const h = contentRef.value.getBoundingClientRect().height
    bodyHeight.value = Math.max(h, window.innerHeight)
  } else {
    bodyHeight.value = window.innerHeight
  }
}

// Animate the scroll position... so cool!
const tick = () => {
  targetScrollY = window.scrollY || window.pageYOffset
  currentScrollY = springLerp(currentScrollY, targetScrollY)
  transformY.value = -currentScrollY
  rafId = requestAnimationFrame(tick)
}

const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    nextTick().then(updateHeight)
  },
)

onMounted(() => {
  nextTick().then(updateHeight)
  window.addEventListener('resize', updateHeight)
  rafId = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeight)
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
  }
})
</script>
