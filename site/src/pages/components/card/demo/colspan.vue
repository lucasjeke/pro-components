<docs lang="zh-CN">
当嵌套子卡片时, 组件会自动切换为 `flex` 弹性盒布局，你可以将 `direction`设置为`column`来指定 Flex 方向，你还可以通过配置 `ghost` 属性为 `true` 来去掉背景色和 padding 方便页内布局。
</docs>

<docs lang="en-US">
当嵌套子卡片时, 组件会自动切换为 `flex` 弹性盒布局，你可以将 `direction`设置为`column`来指定 Flex 方向，你还可以通过配置 `ghost` 属性为 `true` 来去掉背景色和 padding 方便页内布局。
</docs>

<script setup lang="ts">
import { ProCard } from '@antdv-next1/pro-components'
</script>

<template>
  <div class="p-6">
    <ProCard
      direction="column"
      ghost
      :gutter="{
        xs: 8,
        sm: 8,
        md: 8,
        lg: 8,
        xl: 8,
        xxl: 8,
      }"
    >
      <ProCard layout="center" variant="outlined">
        colSpan - 24
      </ProCard>
      <ProCard
        col-xs="24"
        col-sm="12"
        col-md="12"
        col-lg="12"
        col-xl="12"
        col-xxl="24"
        layout="center"
        variant="outlined"
      >
        colSpan - 12
      </ProCard>
      <ProCard
        col-xs="24"
        col-sm="12"
        col-md="8"
        col-lg="6"
        layout="center"
        variant="outlined"
      >
        colSpan - 8
      </ProCard>
      <ProCard :col-span="0" layout="center" variant="outlined">
        colSpan - 0
      </ProCard>
    </ProCard>
    <ProCard :gutter="8" title="24 grids" :style="{ marginBlockStart: '8px' }">
      <ProCard :col-span="12" layout="center" variant="outlined">
        colSpan-12
      </ProCard>
      <ProCard :col-span="6" layout="center" variant="outlined">
        colSpan-6
      </ProCard>
      <ProCard :col-span="6" layout="center" variant="outlined">
        colSpan-6
      </ProCard>
    </ProCard>
    <ProCard :style="{ marginBlockStart: '8px' }" :gutter="8" ghost>
      <ProCard col-flex="200px" layout="center" variant="outlined">
        colFlex - 200px
      </ProCard>
      <ProCard layout="center" variant="outlined">
        Auto
      </ProCard>
    </ProCard>
    <ProCard :style="{ marginBlockStart: '8px' }" :gutter="8" ghost>
      <ProCard variant="outlined" layout="center">
        Auto
      </ProCard>
      <ProCard col-flex="30%" variant="outlined">
        colFlex - 30%
      </ProCard>
    </ProCard>
  </div>
</template>

<style scoped></style>
