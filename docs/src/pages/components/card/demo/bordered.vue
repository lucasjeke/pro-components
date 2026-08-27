<docs lang="zh-CN">
配置 `variant` 属性控制是否卡片带边框。
</docs>

<docs lang="en-US">
配置 `variant` 属性控制是否卡片带边框。
</docs>

<script setup lang="ts">
import { ProCard } from '@antdv-next1/pro-components'
</script>

<template>
  <div class="p-6">
    <ProCard
      title="Title"
      extra="extra"
      tooltip="This is a tooltip"
      :style="{ maxWidth: '300px' }"
      variant="outlined"
    >
      Content
    </ProCard>
  </div>
</template>

<style scoped></style>
