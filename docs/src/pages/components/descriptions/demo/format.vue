<docs lang="zh-CN">
根据配置格式化日期
</docs>

<docs lang="en-US">
Format the date according to format
</docs>

<script setup lang="ts">
import type { ProDescriptionsItemProps } from '@antdv-next1/pro-components'
import { ProDescriptions } from '@antdv-next1/pro-components'
import dayjs from 'dayjs'

const FIXED_BASE_DATE = dayjs('2024-01-15')
const columns: ProDescriptionsItemProps<Record<string, any>, 'text'>[] = [
  {
    label: '日期',
    fieldProps: {
      format: 'YYYY.MM.DD',
    },
    valueType: 'date',
    content: FIXED_BASE_DATE.valueOf(),
  },
  {
    label: '日期区间',
    fieldProps: {
      format: 'YYYY.MM.DD HH:mm:ss',
    },
    valueType: 'dateTimeRange',
    content: [
      FIXED_BASE_DATE.add(-1, 'd').valueOf(),
      FIXED_BASE_DATE.valueOf(),
    ],
  },
  {
    label: '时间',
    fieldProps: {
      format: 'YYYY.MM.DD',
    },
    valueType: 'time',
    content: FIXED_BASE_DATE.valueOf(),
  },
  {
    label: '时间日期',
    fieldProps: {
      format: 'YYYY.MM.DD HH:mm:ss',
    },
    valueType: 'dateTime',
    content: FIXED_BASE_DATE.valueOf(),
  },
  {
    label: '更新时间',
    fieldProps: {
      format: 'YYYY.MM.DD',
    },
    valueType: 'fromNow',
    content: FIXED_BASE_DATE.add(-1, 'month').valueOf(),
  },
]
</script>

<template>
  <div class="p-6">
    <ProDescriptions
      :column="2"
      title="高级定义列表"
      tooltip="包含了从服务器请求，items 等功能"
      :columns="columns"
    />
  </div>
</template>

<style  scoped>
</style>
