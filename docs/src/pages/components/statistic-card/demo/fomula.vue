<docs lang="zh-CN">
`Operation` 可以接受子元素，借此可以实现各种各样的公式计算指标。
</docs>

<docs lang="en-US">
`Operation` 可以接受子元素，借此可以实现各种各样的公式计算指标。
</docs>

<script setup lang="ts">
import { ProStatisticCard, ProStatisticCardGroup, ProStatisticCardOperation } from '@antdv-next1/pro-components'
</script>

<template>
  <div class="p-6">
    <ProStatisticCardGroup>
      <ProStatisticCard
        :statistic="{
          title: 'Service Mesh Count',
          value: 500,
        }"
      />
      <ProStatisticCardOperation>=</ProStatisticCardOperation>
      <ProStatisticCard
        :statistic="{
          title: 'Unpublished',
          value: 234,
        }"
      />
      <ProStatisticCardOperation>+</ProStatisticCardOperation>
      <ProStatisticCard
        :statistic="{
          title: 'Publishing',
          value: 112,
        }"
      />
      <ProStatisticCardOperation>+</ProStatisticCardOperation>
      <ProStatisticCard
        :statistic="{
          title: 'Published',
          value: 255,
        }"
      />
    </ProStatisticCardGroup>
  </div>
</template>

<style scoped>
</style>
