<docs lang="zh-CN">
 使用数值统计配置 `statistic` 和 `chart` 完成基本的指标卡。
</docs>

<docs lang="en-US">
 使用数值统计配置 `statistic` 和 `chart` 完成基本的指标卡。
</docs>

<script setup lang="ts">
import { ProStatistic, ProStatisticCard } from '@antdv-next1/pro-components'
import { EllipsisOutlined, RightOutlined } from '@antdv-next/icons'
import { Space, theme } from 'antdv-next'
import { h } from 'vue'

const { token } = theme.useToken()
</script>

<template>
  <div class="p-6">
    <ProStatisticCard
      :title="h(Space, null, () => [
        h('span', null, 'Department One'),
        h(RightOutlined, {
          style: {
            color: token.colorTextHeading,
          },
        }),
      ])"
      border-beam
      :extra="h(EllipsisOutlined)"
      :statistic="{
        value: 1102893,
        prefix: '¥',
        description: h(Space, null, () => [h(ProStatistic, { title: 'Actual Completion', value: '82.3%' }), h(ProStatistic, { title: 'Current Target', value: '¥6000' }),
        ]),
      }"
      :chart="h('img', { src: 'https://gw.alipayobjects.com/zos/alicdn/BA_R9SIAV/charts.svg', alt: 'chart', width: '100%' })"
      :style="{ width: '268px' }"
    />
  </div>
</template>

<style scoped></style>
