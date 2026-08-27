<docs lang="zh-CN">
基础定义列表
</docs>

<docs lang="en-US">
基础定义列表
</docs>

<script setup lang="ts">
import type { ProDescriptionsItemProps } from '@antdv-next1/pro-components'
import { ProDescriptions } from '@antdv-next1/pro-components'
import { Button } from 'antdv-next'
import dayjs from 'dayjs'

const FIXED_BASE_DATE = dayjs('2024-01-15')
const columns: ProDescriptionsItemProps<Record<string, any>, 'text'>[] = [
  {
    valueType: 'option',
    render: () => [
      h(Button, { key: 'primary', type: 'primary' }, () => '提交审核'),
    ],
  },
  {
    span: 2,
    valueType: 'text',
    renderText: (value) => {
      return `${value}${value}`
    },
    ellipsis: true,
    label: '订单备注',
    content: '客户要求在一季度内完成全部部署上线工作，优先安排专属技术支持团队跟进对接，确保各环节顺利推进',
  },
  {
    label: '合同金额',
    tooltip: '仅供参考，以实际签约合同为准',
    valueType: 'money',
    content: 128000,
  },
  {
    label: '完成进度',
    valueType: 'percent',
    content: 75,
  },
  {
    label: '订单状态',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      pending: {
        text: '待审核',
        status: 'Warning',
      },
      processing: {
        text: '处理中',
        status: 'Processing',
      },
      completed: {
        text: '已完成',
        status: 'Success',
      },
      rejected: {
        text: '已驳回',
        status: 'Error',
      },
    },
    content: 'processing',
  },
  {
    label: '付款方式',
    request: async () => [
      { label: '对公转账', value: 'bank' },
      { label: '支付宝', value: 'alipay' },
      { label: '微信支付', value: 'wechat' },
      { label: '信用卡', value: 'credit' },
    ],
    content: 'bank',
  },
  {
    label: '交付进度',
    valueType: 'progress',
    content: 75,
  },
  {
    label: '下单时间',
    valueType: 'dateTime',
    content: FIXED_BASE_DATE.valueOf(),
  },
  {
    label: '签约日期',
    valueType: 'date',
    content: FIXED_BASE_DATE.valueOf(),
  },
  {
    label: '服务周期',
    valueType: 'dateTimeRange',
    content: [
      FIXED_BASE_DATE.valueOf(),
      FIXED_BASE_DATE.add(365, 'd').valueOf(),
    ],
  },
  {
    label: '创建时间',
    valueType: 'time',
    content: FIXED_BASE_DATE.valueOf(),
  },
  {
    label: '部署脚本',
    valueType: 'code',
    content: `pnpm install\npnpm run build\npnpm run deploy --env production`,
  },
  {
    label: '服务配置',
    valueType: 'jsonCode',
    content: `{
  "service":{
    "name": "user-auth-service",
    "port": 8080,
    "replicas": 3,
    "healthCheck": "/api/health",
    "env": "production",
    "resources": {
      "cpu": "500m",
      "memory": "512Mi"
    }
  }
}`,
  },
]
</script>

<template>
  <div class="p-6">
    <ProDescriptions
      :column="2"
      title="订单详情"
      tooltip="展示订单的详细信息，包括金额、状态、日期等多种值类型"
      :columns="columns"
    />
  </div>
</template>

<style scoped></style>
