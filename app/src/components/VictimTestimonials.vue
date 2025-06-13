<template>
  <div class="bg-pure-black py-16 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div v-for="(shape, index) in shapes" :key="index" class="absolute" :class="shape.className">
        <div class="relative" :style="{ width: `${shape.width}px`, height: `${shape.height}px` }">
          <div
            class="absolute inset-0 rounded-full bg-gradient-to-r to-transparent backdrop-blur-[2px] border-2 border-white/[0.15] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
            :class="shape.gradient"
          ></div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 md:px-6 relative z-10">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
          From Our <span class="text-[#8B5CF6]">Victims</span>
          <span class="absolute text-xs text-[#8B5CF6] ml-1">TS (type sh)</span>
        </h2>

        <div>
          <div class="testimonials-carousel relative">
            <div class="overflow-hidden">
              <div ref="carouselRef" class="flex transition-transform duration-500 ease-in-out">
                <div
                  v-for="(testimonial, index) in victimTestimonials"
                  :key="index"
                  class="min-w-full px-4"
                >
                  <div
                    class="bg-[#121212] p-6 md:p-8 rounded-lg border border-[#1E1E1E] mb-4 shadow-lg"
                  >
                    <div class="mb-6">
                      <div class="flex mb-4">
                        <div v-for="i in 5" :key="i" class="text-lg">
                          <span
                            :class="i <= testimonial.rating ? 'text-[#10B981]' : 'text-gray-600'"
                            >★</span
                          >
                        </div>
                      </div>
                      <p class="text-white/70 italic text-lg md:text-xl">
                        "{{ testimonial.quote }}"
                      </p>
                    </div>
                    <div class="flex items-center">
                      <img
                        class="w-10 h-10 rounded-full bg-[#8B5CF6]/30 flex items-center justify-center text-white mr-3 text-lg"
                        :src="testimonial.profile"
                        :alt="'Profile picture for' + testimonial.name"
                      />
                      <div class="text-left">
                        <p class="text-white font-medium">{{ testimonial.name }}</p>
                        <p class="text-white/50 text-sm">{{ testimonial.title }}</p>
                      </div>
                      <div class="ml-auto text-white/30 text-xs">
                        {{ formatDate(testimonial.date) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-center mt-6 space-x-2">
              <button
                v-for="(_, index) in victimTestimonials"
                :key="index"
                @click="setActiveTestimonial(index)"
                class="w-3 h-3 rounded-full transition-all duration-300"
                :class="currentTestimonial === index ? 'bg-[#8B5CF6]' : 'bg-white/20'"
                aria-label="View testimonial"
              ></button>
            </div>

            <div class="flex justify-center mt-8">
              <button
                @click="prevTestimonial"
                class="mx-2 p-2 rounded-full bg-[#1E1E1E] hover:bg-[#8B5CF6]/20 transition-colors duration-150 cursor-pointer"
                aria-label="Previous testimonial"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-white"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                @click="nextTestimonial"
                class="mx-2 p-2 rounded-full bg-[#1E1E1E] hover:bg-[#8B5CF6]/20 transition-colors duration-150 cursor-pointer"
                aria-label="Next testimonial"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-white"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

import victimTestimonials from '@/static/reviews.json'

const shapes = [
  {
    width: 400,
    height: 100,
    rotate: 8,
    gradient: 'from-[#8B5CF6]/[0.1]',
    className: 'left-[-5%] top-[10%]',
  },
  {
    width: 300,
    height: 80,
    rotate: -12,
    gradient: 'from-[#A855F7]/[0.1]',
    className: 'right-[-3%] bottom-[15%]',
  },
  {
    width: 200,
    height: 60,
    rotate: -5,
    gradient: 'from-[#7C3AED]/[0.1]',
    className: 'left-[10%] bottom-[10%]',
  },
]

const carouselRef = ref(null)
const currentTestimonial = ref(0)
let testimonialInterval = null

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

const setActiveTestimonial = (index) => {
  currentTestimonial.value = index
  if (carouselRef.value) {
    carouselRef.value.style.transform = `translateX(-${index * 100}%)`
  }
}

const nextTestimonial = () => {
  const nextIndex = (currentTestimonial.value + 1) % victimTestimonials.length
  setActiveTestimonial(nextIndex)
}

const prevTestimonial = () => {
  const prevIndex =
    (currentTestimonial.value - 1 + victimTestimonials.length) % victimTestimonials.length
  setActiveTestimonial(prevIndex)
}

const autoAdvanceTestimonials = () => {
  testimonialInterval = setInterval(() => {
    nextTestimonial()
  }, 60000)
}

onMounted(() => {
  autoAdvanceTestimonials()
})

onUnmounted(() => {
  if (testimonialInterval) {
    clearInterval(testimonialInterval)
  }
})
</script>
