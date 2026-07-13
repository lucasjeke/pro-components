<docs lang="zh-CN">
当单独使用时 `ProCard` 就是一个普通的卡片
</docs>

<docs lang="en-US">
当单独使用时 `ProCard` 就是一个普通的卡片
</docs>

<script setup lang="ts">
import { ProCheckCard } from '@antdv-next1/pro-components'
</script>

<template>
  <div class="p-6">
    <ProCheckCard
      avatar="https://gw.alipayobjects.com/zos/bmw-prod/f601048d-61c2-44d0-bf57-ca1afe7fd92e.svg"
      title="示例一"
      description="选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念。"
      default-checked
      border-beam
    />
  </div>
</template>

<style scoped></style>
