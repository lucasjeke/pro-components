<docs lang="zh-CN">
你可以嵌套指标卡组件来将指标分组，以及 `Divider` 子组件来分隔这些指标。
</docs>

<docs lang="en-US">
你可以嵌套指标卡组件来将指标分组，以及 `Divider` 子组件来分隔这些指标。
</docs>

<script setup lang="ts">
import { ProStatisticCard, ProStatisticCardDivider, ProStatisticCardGroup } from '@antdv-next1/pro-components'
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
            title: 'Frozen Amount',
            value: 20190102,
            precision: 2,
            suffix: 'Yuan',
          }"
          :chart="h('img', {
            src: 'https://gw.alipayobjects.com/zos/alicdn/RLeBTRNWv/bianzu%25252043x.png',
            alt: 'Histogram',
            width: '100%',
          })"
        />
        <ProStatisticCardDivider :type="responsive ? 'horizontal' : 'vertical'" />
        <ProStatisticCard
          :statistic="{
            title: 'Design Resources',
            value: 234,
          }"
          :chart="h('img', {
            src: 'https://gw.alipayobjects.com/zos/alicdn/RLeBTRNWv/bianzu%25252043x.png',
            alt: 'Histogram',
            width: '100%',
          })"
        />
        <ProStatisticCardDivider :type="responsive ? 'horizontal' : 'vertical'" />
        <ProStatisticCard
          :statistic="{
            title: 'Information Completeness',
            value: 5,
            suffix: '/ 100',
          }"
          :chart="h('img', {
            src: 'https://gw.alipayobjects.com/zos/alicdn/RLeBTRNWv/bianzu%25252043x.png',
            alt: 'Histogram',
            width: '100%',
          })"
        />
      </ProStatisticCardGroup>
    </ResizeObserver>
  </div>
</template>

<style scoped>
</style>
