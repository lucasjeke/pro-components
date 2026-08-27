<docs lang="zh-CN">
当添加分隔线时会自动增加标题的高度与内容区域分开。
</docs>

<docs lang="en-US">
当添加分隔线时会自动增加标题的高度与内容区域分开。
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
      header-bordered
    >
      Content
    </ProCard>
  </div>
</template>

<style scoped></style>
