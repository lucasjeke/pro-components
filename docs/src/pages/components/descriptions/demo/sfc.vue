<docs lang="zh-CN">
支持通过 ProDescriptionsItem 子组件声明描述项，默认插槽作为展示内容。
</docs>

<docs lang="en-US">
Declare description entries with ProDescriptionsItem and use its default slot as content.
</docs>

<script setup lang="ts">
import { ProDescriptions, ProDescriptionsItem } from '@antdv-next1/pro-components'
import dayjs from 'dayjs'

const FIXED_BASE_DATE = dayjs('2024-01-15')
</script>

<template>
  <div class="p-6">
    <ProDescriptions
      :column="2"
      title="高级定义列表"
      tooltip="通过 SFC 子组件声明描述项"
    >
      <ProDescriptionsItem
        label="日期"
        value-type="date"
        :field-props="{
          format: 'YYYY.MM.DD',
        }"
        :content="FIXED_BASE_DATE.valueOf() "
      />
      <ProDescriptionsItem
        label="日期区间"
        value-type="dateTimeRange"
        :field-props="{
          format: 'YYYY.MM.DD HH:mm:ss',
        }"
        :content="[FIXED_BASE_DATE.add(-1, 'd').valueOf(), FIXED_BASE_DATE.valueOf()]"
      />
    </ProDescriptions>
  </div>
</template>

<style scoped></style>
