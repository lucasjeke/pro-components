<docs lang="zh-CN">
通过 `tabProps.type` 设置为 `card` 来使用卡片式页签。
</docs>

<docs lang="en-US">
Set `tabProps.type` to `card` to use card-style tabs.
</docs>

<script setup lang="ts">
import { ProCard } from '@antdv-next1/pro-components'

const activeTabKey = ref('overview')

const contentMap = {
  overview: 'Overview content',
  details: 'Details content',
  history: 'History content',
} as const

const content = computed(() => contentMap[activeTabKey.value as keyof typeof contentMap])
</script>

<template>
  <div class="p-6">
    <ProCard
      v-model:active-tab-key="activeTabKey"
      :tab-list="[
        { key: 'overview', label: 'Overview' },
        { key: 'details', label: 'Details' },
        { key: 'history', label: 'History' },
      ]"
      :tab-props="{ type: 'card' }"
    >
      {{ content }}
    </ProCard>
  </div>
</template>

<style scoped></style>
