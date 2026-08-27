<docs lang="zh-CN">
默认卡片布局不可换行，你可以配置 `wrap` 为 `true` 来让多个卡片之间可以换行，适用于多个卡片排版的情况。
</docs>

<docs lang="en-US">
默认卡片布局不可换行，你可以配置 `wrap` 为 `true` 来让多个卡片之间可以换行，适用于多个卡片排版的情况。
</docs>

<script setup lang="ts">
import { ProCard } from '@antdv-next1/pro-components'
</script>

<template>
  <div class="p-6">
    <ProCard
      :style="{ marginBlockStart: '8px' }"
      :gutter="[16, 16]"
      wrap
      title="Wrap"
    >
      <ProCard
        :col-span="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }"
        layout="center"
      >
        Col
      </ProCard>
      <ProCard
        :col-span="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }"
        layout="center"
      >
        Col
      </ProCard>
      <ProCard
        :col-span="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }"
        layout="center"
      >
        Col
      </ProCard>
      <ProCard
        :col-span="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }"
      >
        Col
      </ProCard>
    </ProCard>
  </div>
</template>

<style scoped></style>
