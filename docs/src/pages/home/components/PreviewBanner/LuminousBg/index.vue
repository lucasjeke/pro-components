<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, reactive } from 'vue'
import { useAppStore } from '@/store/modules/app'

interface BubbleConfig {
  size: number
  left: string
  top: string
  color: string
  offsetXMultiple?: number
  offsetYMultiple?: number
  defaultOpacity?: number
}

interface BubbleState extends BubbleConfig {
  offsetX: number
  offsetY: number
  opacity: number
  scale: number
}

const MAX_OFFSET = 200

const appStore = useAppStore()
const { darkMode } = storeToRefs(appStore)

const bubbles = reactive<BubbleState[]>([
  {
    size: 300,
    color: '#ee35f1',
    left: '0vw',
    top: '0vh',
    offsetXMultiple: 2,
    defaultOpacity: 0.2,
    offsetY: 0,
    offsetX: 0,
    opacity: 0.2,
    scale: 1,
  },
  {
    size: 300,
    color: '#5939dc',
    left: '30vw',
    top: '80vh',
    defaultOpacity: 0.1,
    offsetY: 0,
    offsetX: 0,
    opacity: 0.1,
    scale: 1,
  },
  {
    size: 300,
    color: '#00D6FF',
    left: '100vw',
    top: '50vh',
    offsetYMultiple: 2,
    defaultOpacity: 0.2,
    offsetY: 0,
    offsetX: 0,
    opacity: 0.2,
    scale: 1,
  },
])

const timeouts = new Map<number, ReturnType<typeof setTimeout>>()

function randomize(index: number) {
  const bubble = bubbles[index]
  if (!bubble)
    return

  const offsetXMultiple = bubble.offsetXMultiple ?? 1
  const offsetYMultiple = bubble.offsetYMultiple ?? 1

  bubble.offsetX = (Math.random() - 0.5) * MAX_OFFSET * 2 * offsetXMultiple
  bubble.offsetY = (Math.random() - 0.5) * MAX_OFFSET * 2 * offsetYMultiple
  bubble.opacity = darkMode.value
    ? 0.1 + Math.random() * 0.2
    : 0.1 + Math.random() * 0.05
  bubble.scale = 1 + Math.random() * 1

  const randomTimeout = Math.random() * 2000 + 3000
  const timer = setTimeout(() => randomize(index), randomTimeout)
  timeouts.set(index, timer)
}

onMounted(() => {
  bubbles.forEach((_, index) => {
    randomize(index)
  })
})

onBeforeUnmount(() => {
  timeouts.forEach(timeout => clearTimeout(timeout))
  timeouts.clear()
})
</script>

<template>
  <div
    class="!absolute !inset-0 !inset-l-50% !transform-translate-x--50% !transform-scale-[1.5] !of-hidden !w-150 !h-100 !bg-[linear-gradient(135deg,rgb(114_,_46_,_209)_0%_,_rgb(22_,_119_,_255)_30%_,_rgb(245_,_34,_45)_70%_,_rgb(19_,_194,_194)_100%)]
    bg-repeat
    bg-[length:200%_200%]
    bg-[position:0%_0%]
    bg-scroll
    !inset-t--62.5
    !bg-[rgba(0,0,0,0)]
    !bg-clip-border
    animate-[glow_10s_ease_0s_infinite_normal_none_running]
    !filter-blur-69
    !opacity-[.2]"
    aria-hidden="true"
  />
</template>

<style>
@keyframes glow {
  0% {
    background-position: 0px -100%;
  }
  50% {
    background-position: 200% 50%;
  }
  100% {
    background-position: 0px -100%;
  }
}
</style>
