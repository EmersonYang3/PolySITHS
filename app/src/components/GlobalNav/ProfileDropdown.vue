<template>
  <div ref="dropdownContainer" class="relative">
    <button
      type="button"
      @click="toggleDropdown"
      class="flex h-9 w-9 items-center justify-center rounded-full border border-border-light bg-soft-black text-white hover:border-purple cursor-pointer transition-all overflow-hidden"
      aria-haspopup="true"
      :aria-expanded="isDropdownVisible"
    >
      <img
        :src="
          profileUrl ||
          'https://static.vecteezy.com/system/resources/thumbnails/030/504/836/small/avatar-account-flat-isolated-on-transparent-background-for-graphic-and-web-design-default-social-media-profile-photo-symbol-profile-and-people-silhouette-user-icon-vector.jpg'
        "
        alt="User Profile"
        class="h-full w-full object-cover rounded-full"
      />
    </button>

    <div
      v-if="isDropdownVisible"
      class="absolute right-0 mt-2 w-48 origin-top-right rounded border border-border-light bg-soft-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
    >
      <div class="py-1" role="none">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isDropdownVisible = ref(false)
const dropdownContainer = ref<HTMLElement | null>(null)

defineProps<{ profileUrl?: string }>()

function toggleDropdown() {
  isDropdownVisible.value = !isDropdownVisible.value
}

function handleOutsideClick(event: MouseEvent) {
  if (
    isDropdownVisible.value &&
    dropdownContainer.value &&
    !dropdownContainer.value.contains(event.target as Node)
  ) {
    isDropdownVisible.value = false
  }
}

import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>
