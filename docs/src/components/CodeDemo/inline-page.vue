<script setup lang="ts">
import { computed, markRaw, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { compileSfcSource } from './utils/compileSfc'

const props = defineProps<{
  id?: string
  source?: string
}>()

const route = useRoute()
const source = computed(() => {
  if (props.source)
    return props.source

  const value = route.query.source
  return typeof value === 'string' ? value : ''
})
const decodedSource = computed(() => source.value ? decodeURIComponent(source.value) : '')
const component = shallowRef<any>(null)
const compileError = shallowRef<string | null>(null)

watch(decodedSource, async (value) => {
  component.value = null
  compileError.value = null

  if (!value)
    return

  const result = await compileSfcSource(value)
  if (result.component) {
    component.value = markRaw(result.component)
    return
  }

  compileError.value = result.error
}, { immediate: true })
</script>

<template>
  <div class="p-3">
    <component :is="component" v-if="component" />
    <a-alert v-else-if="compileError" type="error" show-icon :message="compileError" />
    <a-empty v-else description="No demo source" />
  </div>
</template>
