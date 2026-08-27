<docs lang="zh-CN">
你可以给每个数值统计配置 `status` 展示其状态。
</docs>

<docs lang="en-US">
You can set the `status` property for each numerical statistic to display its status.
</docs>

<script setup lang="ts">
import { ProStatisticCard, ProStatisticCardDivider, ProStatisticCardGroup } from '@antdv-next1/pro-components'
</script>

<template>
  <div class="p-6">
    <ProStatisticCardGroup>
      <ProStatisticCard
        :statistic="{
          title: 'All',
          tooltip: 'Help text',
          value: 10,
        }"
      />
      <ProStatisticCardDivider />
      <ProStatisticCard
        :statistic="{
          title: 'Unpublished',
          value: 5,
          status: 'default',
        }"
      />
      <ProStatisticCard
        :statistic="{
          title: 'Publishing',
          value: 3,
          status: 'processing',
        }"
      />
      <ProStatisticCard
        :statistic="{
          title: 'Publishing Error',
          value: 2,
          status: 'error',
        }"
      />
      <ProStatisticCard
        :statistic="{
          title: 'Published Successfully',
          value: '-',
          status: 'success',
        }"
      />
    </ProStatisticCardGroup>
  </div>
</template>

<style lang="less" scoped></style>
