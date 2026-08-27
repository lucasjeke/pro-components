<docs lang="zh-CN">
可以放在卡片内部，展示多层级结构的信息。
</docs>

<docs lang="en-US">
可以放在卡片内部，展示多层级结构的信息。
</docs>

<script setup lang="ts">
import { ProCard } from '@antdv-next1/pro-components'
</script>

<template>
  <div class="p-6">
    <ProCard
      title="Horizontal Inner Card"
      header-bordered
      :gutter="16"
    >
      <ProCard title="Inner Card Title" type="inner">
        Inner Card Content
      </ProCard>
      <ProCard title="Inner Card Title" type="inner">
        Inner Card Content
      </ProCard>
    </ProCard>
    <ProCard
      title="Vertical Inner Card"
      header-bordered
      direction="column"
      :gutter="[0, 16]"
      :style="{ marginBlockStart: '8px' }"
    >
      <ProCard title="Inner Card Title" type="inner">
        Inner Card Content
      </ProCard>
      <ProCard title="Inner Card Title" type="inner">
        Inner Card Content
      </ProCard>
    </ProCard>
  </div>
</template>

<style scoped></style>
