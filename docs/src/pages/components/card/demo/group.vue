<docs lang="zh-CN">
配合 `ghost`幽灵模式和可折叠能力可以实现卡片组展开。
</docs>

<docs lang="en-US">
Combine ghost mode with a collapsible parent card to build an expandable card group.
</docs>

<script setup lang="ts">
import { ProCard } from '@antdv-next1/pro-components'
</script>

<template>
  <div class="p-6">
    <ProCard
      title="Card Group Expanded"
      collapsible
      ghost
      :gutter="8"
    >
      <ProCard layout="center">
        Card Content
      </ProCard>
      <ProCard layout="center">
        Card Content
      </ProCard>
      <ProCard layout="center">
        Card Content
      </ProCard>
    </ProCard>
  </div>
</template>

<style scoped></style>
