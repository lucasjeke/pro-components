<docs lang="zh-CN">
配置 `loading`属性为`true`控制卡片加载中，也可以传入 DOM 给`loading`来自定义 loading 展示。
</docs>

<docs lang="en-US">
配置 `loading`属性为`true`控制卡片加载中，也可以传入 DOM 给`loading`来自定义 loading 展示。
</docs>

<script setup lang="ts">
import { ProCard } from '@antdv-next1/pro-components'
import { h } from 'vue'
</script>

<template>
  <div class="p-6">
    <ProCard loading :style="{ maxWidth: '300px' }">
      Content
    </ProCard>
    <ProCard
      loading
      :style="{ maxWidth: '300px', marginBlockStart: '16px' }"
      layout="center"
    >
      Content
    </ProCard>
    <ProCard
      title="Custom Loading"
      extra="extra"
      :loading="h('div', null, 'Loading')"
      :style="{ maxWidth: '300px', marginBlockStart: '16px' }"
    >
      Content
    </ProCard>
  </div>
</template>

<style scoped></style>
