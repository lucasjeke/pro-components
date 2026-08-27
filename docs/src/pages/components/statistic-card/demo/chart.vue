<docs lang="zh-CN">
当图表单独展示在卡片中时。
</docs>

<docs lang="en-US">
When the chart is displayed alone in the card.
</docs>

<script setup lang="ts">
import { ProStatisticCard } from '@antdv-next1/pro-components'
import { EllipsisOutlined } from '@antdv-next/icons'
import { h } from 'vue'
</script>

<template>
  <div class="p-6">
    <ProStatisticCard
      title="Market Trend"
      tooltip="Market Description"
      :style="{ maxWidth: '480px' }"
      :extra="h(EllipsisOutlined)"
      :chart="h('img', {
        src: 'https://gw.alipayobjects.com/zos/alicdn/a-LN9RTYq/zhuzhuangtu.svg',
        alt: 'Bar Chart',
        width: '100%',
      })"
    />
  </div>
</template>

<style scoped>
</style>
