<template>
  <div
    class="relative w-full flex items-center justify-center overflow-hidden bg-pure-black"
    :style="{ height: 'calc(100vh - 4rem)' }"
  >
    <div class="absolute inset-0 overflow-hidden">
      <div
        v-for="(shape, index) in shapes"
        :key="index"
        class="absolute"
        :class="shape.className"
        ref="shapeRefs"
      >
        <div class="relative" :style="{ width: `${shape.width}px`, height: `${shape.height}px` }">
          <div
            class="absolute inset-0 rounded-full bg-gradient-to-r to-transparent backdrop-blur-[2px] border-2 border-white/[0.15] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
            :class="shape.gradient"
          ></div>
        </div>
      </div>
    </div>

    <div class="relative z-10 container mx-auto px-4 md:px-6 overflow-visible pr-[500px]">
      <div class="max-w-5xl mx-auto text-center">
        <h1
          ref="titleRef"
          class="text-5xl sm:text-7xl md:text-9xl font-bold mb-6 md:mb-8 tracking-tight opacity-0"
        >
          <span class="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80"
            >Bet on</span
          >
          <br />
          <span
            class="bg-clip-text text-transparent bg-gradient-to-r from-[#D8B4FE] via-[#A855F7] to-[#7C3AED] overflow-visible"
          >
            School Events
          </span>
        </h1>

        <p
          ref="subtitleRef"
          class="text-xl sm:text-2xl md:text-3xl text-white/40 mb-10 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-4 opacity-0"
        >
          and like stuf. Pride logo type sh for Eric Chen.
        </p>

        <div ref="buttonsRef" class="flex flex-wrap justify-center gap-4 opacity-0">
          <button
            class="login-button relative bg-[#8B5CF6] text-white px-6 py-3 text-base rounded-lg transition-all hover:scale-[1.05] active:scale-[0.95] cursor-pointer"
            @click="routeToLogin"
          >
            <span>Log in</span>
          </button>

          <button
            class="leave-button relative px-6 py-3 text-base rounded-lg transition-all border-2 border-[#8B5CF6] text-[#8B5CF6] hover:scale-[1.05] active:scale-[0.95] cursor-pointer"
            @click="routeToSignUp"
          >
            <span>Sign up</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

import { useRouter } from 'vue-router'
const Router = useRouter()

function routeToLogin() {
  Router.push({ name: 'login' })
}

function routeToSignUp() {
  Router.push({ name: 'signup' })
}

import { gsap } from 'gsap'

const shapeRefs = ref([])
const titleRef = ref(null)
const subtitleRef = ref(null)
const buttonsRef = ref(null)

const shapes = [
  {
    width: 600,
    height: 140,
    rotate: 12,
    gradient: 'from-[#8B5CF6]/[0.15]',
    className: 'left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]',
    delay: 0.3,
  },
  {
    width: 500,
    height: 120,
    rotate: -15,
    gradient: 'from-[#A855F7]/[0.15]',
    className: 'right-[-5%] md:right-[0%] top-[70%] md:top-[75%]',
    delay: 0.5,
  },
  {
    width: 300,
    height: 80,
    rotate: -8,
    gradient: 'from-[#7C3AED]/[0.15]',
    className: 'left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]',
    delay: 0.4,
  },
  {
    width: 200,
    height: 60,
    rotate: 20,
    gradient: 'from-[#D8B4FE]/[0.15]',
    className: 'right-[15%] md:right-[20%] top-[10%] md:top-[15%]',
    delay: 0.6,
  },
  {
    width: 150,
    height: 40,
    rotate: -25,
    gradient: 'from-[#C084FC]/[0.15]',
    className: 'left-[20%] md:left-[25%] top-[5%] md:top-[10%]',
    delay: 0.7,
  },
]

let shapesTimeline = null
let floatingAnimations = []

onMounted(() => {
  shapesTimeline = gsap.timeline()

  shapeRefs.value.forEach((shape, index) => {
    const shapeData = shapes[index]

    shapesTimeline.fromTo(
      shape,
      {
        opacity: 0,
        y: -150,
        rotation: shapeData.rotate - 15,
      },
      {
        opacity: 1,
        y: 0,
        rotation: shapeData.rotate,
        duration: 2.4,
        ease: 'power2.out',
        delay: shapeData.delay,
      },
      0,
    )

    const floatingTl = gsap.timeline({ repeat: -1, yoyo: true })
    floatingTl
      .to(shape.firstChild, {
        y: 15,
        duration: 6,
        ease: 'sine.inOut',
      })
      .to(shape.firstChild, {
        y: 0,
        duration: 6,
        ease: 'sine.inOut',
      })

    floatingAnimations.push(floatingTl)
  })

  gsap
    .timeline()
    .to(titleRef.value, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      delay: 0.7,
    })
    .to(
      subtitleRef.value,
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
      },
      '-=0.5',
    )
    .to(
      buttonsRef.value,
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
      },
      '-=0.5',
    )
})

onUnmounted(() => {
  if (shapesTimeline) {
    shapesTimeline.kill()
  }

  floatingAnimations.forEach((animation) => {
    animation.kill()
  })
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

.font-pacifico {
  font-family: 'Pacifico', cursive;
}
</style>
