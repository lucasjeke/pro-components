<script setup lang="ts">
import { cdn } from '@/utils/dependency'

const cdnOptions = [
  { label: 'jsDelivr', value: 'jsdelivr' },
  { label: 'jsDelivr Fastly', value: 'jsdelivr-fastly' },
  { label: 'unpkg', value: 'unpkg' },
]
</script>

<template>
  <a-form layout="vertical">
    <a-form-item label="CDN">
      <a-select
        v-model:value="cdn"
        style="width: 200px"
        :options="cdnOptions"
        :get-popup-container="(trigger: HTMLElement) => trigger.parentElement!"
      />
    </a-form-item>
  </a-form>
</template>
