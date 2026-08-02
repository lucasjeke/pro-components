<docs lang="zh-CN">
栅格常常需要和间隔进行配合，你可以使用 `gutter` 属性，我们推荐使用 `(16+8n)px` 作为栅格间隔 (n 是自然数)，如果要支持响应式，可以写成 `{ xs: 8, sm: 16, md: 24, lg: 32 }`。如果需要垂直间距，可以写成数组形式 `[水平间距, 垂直间距][16, { xs: 8, sm: 16, md: 24, lg: 32 }]`。
</docs>

<docs lang="en-US">
栅格常常需要和间隔进行配合，你可以使用 `gutter` 属性，我们推荐使用 `(16+8n)px` 作为栅格间隔 (n 是自然数)，如果要支持响应式，可以写成 `{ xs: 8, sm: 16, md: 24, lg: 32 }`。如果需要垂直间距，可以写成数组形式 `[水平间距, 垂直间距][16, { xs: 8, sm: 16, md: 24, lg: 32 }]`。
</docs>

<script setup lang="ts">
import { ProCard } from '@antdv-next1/pro-components'
</script>

<template>
  <div class="p-6">
    <ProCard>
      asdas
    </ProCard>
  </div>
</template>

<style scoped></style>
