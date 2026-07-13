<docs lang="zh-CN">
当然你也可以通过 `style` 或 `className` 自定义卡片大小。
</docs>

<docs lang="en-US">
当然你也可以通过 `style` 或 `className` 自定义卡片大小。
</docs>

<script setup lang="ts">
import { ProCheckCard } from '@antdv-next1/pro-components'
</script>

<template>
  <ProCheckCard
    title="Card title"
    description="This is the description"
    :style="{ width: '200px', height: '200px' }"
  />
</template>

<style scoped></style>
