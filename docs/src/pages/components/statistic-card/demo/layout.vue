<docs lang="zh-CN">
配合 `ProCard` 的卡片切分能力可以实现复杂的卡片布局。
</docs>

<docs lang="en-US">
By using the card splitting capability of `ProCard`, you can achieve complex card layouts.
</docs>

<script setup lang="ts">
import { ProCard, ProStatistic, ProStatisticCard } from '@antdv-next1/pro-components'
import ResizeObserver from '@v-c/resize-observer'
import { h } from 'vue'

const responsive = shallowRef(false)
</script>

<template>
  <div class="p-6">
    <ResizeObserver
      @resize="(offset) => {
        responsive = offset.width < 596
      }"
    >
      <ProCard
        title="Data Overview"
        extra="Friday, September 28, 2019"
        :split="responsive ? 'horizontal' : 'vertical'"
        header-bordered
      >
        <ProCard split="horizontal">
          <ProCard split="horizontal">
            <ProCard split="vertical">
              <ProStatisticCard
                :statistic="{
                  title: 'Total Traffic Yesterday',
                  value: 234,
                  description: h(ProStatistic, {
                    title: 'Compared to Monthly Average Traffic',
                    value: '8.04%',
                    trend: 'down',
                  }),
                }"
              />
              <ProStatisticCard
                :statistic="{
                  title: 'Total Traffic This Month',
                  value: 234,
                  description: h(ProStatistic, {
                    title: 'Month-on-Month',
                    value: '8.04%',
                    trend: 'up',
                  }),
                }"
              />
            </ProCard>
            <ProCard split="vertical">
              <ProStatisticCard
                :statistic="{
                  title: 'Ongoing Experiments',
                  value: '12/56',
                  suffix: 'items',
                }"
              />
              <ProStatisticCard
                :statistic="{
                  title: 'Total Historical Experiments',
                  value: '134',
                  suffix: 'items',
                }"
              />
            </ProCard>
          </ProCard>
          <ProStatisticCard
            title="Traffic Trends"
            :chart="h('img', {
              src: 'https://gw.alipayobjects.com/zos/alicdn/_dZIob2NB/zhuzhuangtu.svg',
              alt: 'Bar Chart',
              width: '100%',
            })"
          />
        </ProCard>
        <ProStatisticCard
          title="Traffic Usage"
          :chart="h('img', {
            src: 'https://gw.alipayobjects.com/zos/alicdn/qoYmFMxWY/jieping2021-03-29%252520xiawu4.32.34.png',
            alt: 'Dashboard',
            width: '100%',
          })"
        />
      </ProCard>
    </ResizeObserver>
  </div>
</template>

<style lang="less" scoped></style>
