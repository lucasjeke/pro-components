<docs lang="zh-CN">
你可以使用 `Statistic` 组件配置布局 `layout` 为 `inline` 以及 `trend` 来展示环比趋势。
</docs>

<docs lang="en-US">
You can use the `Statistic` component with the `layout` property set to `inline` and the `trend` property to display the sequential trend.
</docs>

<script setup lang="ts">
import { ProStatistic, ProStatisticCard } from '@antdv-next1/pro-components'
</script>

<template>
  <div class="p-6">
    <ProStatisticCard :style="{ width: '160px' }">
      <ProStatistic title="Daily Comparison" value="7.60%" trend="up" />
      <ProStatistic title="Weekly Comparison" value="7.60%" trend="down" />
      <ProStatistic title="Weekly Comparison" value="0.00%" />
    </ProStatisticCard>
  </div>
</template>

<style  scoped></style>
