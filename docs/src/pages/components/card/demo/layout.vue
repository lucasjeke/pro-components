<docs lang="zh-CN">
配置 `layout` 属性为 `center` 控制内容垂直居中，设置居中时内容部分转为 `flex` 布局，可以使用 `direction` 控制 `flex` 方向。
</docs>

<docs lang="en-US">
配置 `layout` 属性为 `center` 控制内容垂直居中，设置居中时内容部分转为 `flex` 布局，可以使用 `direction` 控制 `flex` 方向。
</docs>

<script setup lang="ts">
import { ProCard } from '@antdv-next1/pro-components'
</script>

<template>
  <div class="p-6">
    <ProCard
      title="Title"
      extra="extra"
      layout="center"
      direction="column"
      :style="{ maxWidth: '300px', height: '200px' }"
    >
      <div>123</div>
      <div>456</div>
    </ProCard>
  </div>
</template>

<style scoped></style>
