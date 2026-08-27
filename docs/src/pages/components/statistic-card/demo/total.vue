<docs lang="zh-CN">
总分 / 主次关系
</docs>

<docs lang="en-US">
总分 / 主次关系
</docs>

<script setup lang="ts">
import { ProStatistic, ProStatisticCard, ProStatisticCardDivider, ProStatisticCardGroup } from '@antdv-next1/pro-components'
import ResizeObserver from '@v-c/resize-observer'
import { h, shallowRef } from 'vue'

const responsive = shallowRef(false)
</script>

<template>
  <div class="p-6">
    <ResizeObserver
      @resize="(offset) => {
        responsive = offset.width < 596
      }"
    >
      <ProStatisticCardGroup :direction="responsive ? 'column' : 'row'">
        <ProStatisticCard
          :statistic="{
            title: 'Total Traffic (Visits)',
            value: 601986875,
          }"
        />
        <ProStatisticCardDivider
          :orientation="responsive ? 'horizontal' : 'vertical'"
        />
        <ProStatisticCard
          :statistic="{
            title: 'Paid Traffic',
            value: 3701928,
            description: h(ProStatistic, {
              title: 'Proportion',
              value: '61.5%',
            }),
          }"
          :chart="h('img', {
            src: 'https://gw.alipayobjects.com/zos/alicdn/ShNDpDTik/huan.svg',
            alt: 'Percentage',
            width: '100%',
          })"
          chart-placement="left"
        />
        <ProStatisticCard
          :statistic="{
            title: 'Free Traffic',
            value: 1806062,
            description: h(ProStatistic, {
              title: 'Proportion',
              value: '38.5%',
            }),
          }"
          :chart="h('img', {
            src: 'https://gw.alipayobjects.com/zos/alicdn/6YR18tCxJ/huanlv.svg',
            alt: 'Percentage',
            width: '100%',
          })"
          chart-placement="left"
        />
      </ProStatisticCardGroup>
    </ResizeObserver>
  </div>
</template>

<style scoped>
</style>
