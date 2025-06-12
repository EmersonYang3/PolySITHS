<template>
  <div class="relative w-full max-w-2xl">
    <label for="search-input" class="sr-only">Search</label>
    <div
      class="relative flex items-center bg-off-black border border-border rounded-xl overflow-hidden transition-all duration-200 ease-in-out"
      :class="{
        'border-purple ring-2 ring-purple-248 bg-soft-black': isFocused,
        'hover:border-border-light': !isFocused,
      }"
    >
      <div class="flex items-center justify-center w-12 h-12">
        <SearchIcon class="w-5 h-5 text-gray-400" />
      </div>

      <input
        id="search-input"
        type="text"
        placeholder="Twin search something up twin..."
        v-model="searchText"
        @input="onInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
        class="flex-1 h-12 px-0 py-3 bg-transparent border-none outline-none text-white placeholder-gray-500 text-base font-medium"
      />

      <button
        v-if="searchText"
        type="button"
        @click="handleClear"
        class="flex items-center justify-center w-10 h-10 mr-1 text-gray-400 hover:text-white hover:bg-soft-black rounded-lg transition-all duration-150 ease-in-out"
      >
        <XIcon class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Search as SearchIcon, X as XIcon } from 'lucide-vue-next'

const searchText = ref('')
const isFocused = ref(false)

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void
}>()

watch(searchText, (val) => {
  emit('update:searchQuery', val)
})

function onInput() {
  emit('update:searchQuery', searchText.value)
}

function handleClear() {
  searchText.value = ''
  emit('update:searchQuery', '')
}
</script>
