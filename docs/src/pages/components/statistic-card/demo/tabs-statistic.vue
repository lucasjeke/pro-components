<docs lang="zh-CN">
结合 `Statistic` 可以实现带指标统计的页签。
</docs>

<docs lang="en-US">
By combining with `Statistic`, you can create tabs with indicator statistics.
</docs>

<script setup lang="ts">
import type { ProStatisticProps } from '@antdv-next1/pro-components'
import { ProCard, ProStatistic } from '@antdv-next1/pro-components'
import { h } from 'vue'

const items = [
  { key: '1', title: 'All', value: 10, total: true },
  { key: '2', status: 'default', title: 'Unpublished', value: 5 },
  { key: '3', status: 'processing', title: 'Publishing', value: 3 },
  { key: '4', status: 'error', title: 'Publishing Error', value: 1 },
  { key: '5', status: 'success', title: 'Published Successfully', value: 1 },
]
</script>

<template>
  <div class="p-6">
    <ProCard
      :tab-list="items.map((item) => ({
        key: item.key,
        style: { width: '100%' },
        label: h(ProStatistic, {
          layout: 'vertical',
          title: item.title,
          value: item.value,
          status: item.status as ProStatisticProps['status'],
          style: {
            width: '120px',
            borderInlineEnd: item.total ? '1px solid #f0f0f0' : undefined,
          },
        }),
        content: h('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fafafa',
            height: '100px',
          },
        }, `Related display content ${item.title}`),
      }))"
    />
  </div>
</template>

<style  scoped></style>
