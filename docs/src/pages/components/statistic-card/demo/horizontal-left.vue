<docs lang="zh-CN">
配置 `chartPlacement` 为 `left` 可以指定图表在数值统计的左边。
</docs>

<docs lang="en-US">
Set the `chartPlacement` property to `left` to specify that the chart should be on the left side of the numerical statistic.
</docs>

<script setup lang="ts">
import { ProStatistic, ProStatisticCard } from '@antdv-next1/pro-components'
import { h } from 'vue'
</script>

<template>
  <div class="p-6">
    <ProStatisticCard
      chart-placement="left"
      :statistic="{
        title: 'Frozen Amount',
        value: 112893,
        precision: 2,
        suffix: 'Yuan',
        description: [h(ProStatistic, {
                        title: 'Weekly Comparison',
                        value: '6.47%',
                        trend: 'up',
                      }),
                      h(ProStatistic, {
                        title: 'Monthly Comparison',
                        value: '6.47%',
                        trend: 'down',
                      }),
        ],
      }"
      :style="{ maxWidth: '584px' }"
      :chart="h('img', {
        src: 'https://gw.alipayobjects.com/zos/alicdn/snEBTn9ax/zhexiantuchang.svg',
        alt: 'Line Chart',
        width: '100%',
      })"
    />
  </div>
</template>

<style lang="less" scoped></style>
