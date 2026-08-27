<docs lang="zh-CN">
你可以给每个数值统计配置 `icon` 展示其图标。
</docs>

<docs lang="en-US">
You can set the `icon` property for each numerical statistic to display its icon.
</docs>

<script setup lang="ts">
import { ProStatisticCard, ProStatisticCardGroup } from '@antdv-next1/pro-components'
import ResizeObserver from '@v-c/resize-observer'
import { h } from 'vue'

const imgStyle = {
  display: 'block',
  width: '42px',
  height: '42px',
}

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
            title: 'Payment Amount',
            value: 2176,
            icon: h('img', {
              style: imgStyle,
              src: 'https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*dr_0RKvVzVwAAAAAAAAAAABkARQnAQ',
              alt: 'icon',
            }),
          }"
        />
        <ProStatisticCard
          :statistic="{
            title: 'Number of Visitors',
            value: 475,
            icon: h('img', {
              style: imgStyle,
              src: 'https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*-jVKQJgA1UgAAAAAAAAAAABkARQnAQ',
              alt: 'icon',
            }),
          }"
        />
        <ProStatisticCard
          :statistic="{
            title: 'Number of Successful Orders',
            value: 87,
            icon: h('img', {
              style: imgStyle,
              src: 'https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*FPlYQoTNlBEAAAAAAAAAAABkARQnAQ',
              alt: 'icon',
            }),
          }"
        />
        <ProStatisticCard
          :statistic="{
            title: 'Page Views',
            value: 1754,
            icon: h('img', {
              style: imgStyle,
              src: 'https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*pUkAQpefcx8AAAAAAAAAAABkARQnAQ',
              alt: 'icon',
            }),
          }"
        />
      </ProStatisticCardGroup>
    </ResizeObserver>
  </div>
</template>

<style lang="less" scoped></style>
