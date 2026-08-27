<docs lang="zh-CN">
可编辑的定义列表
</docs>

<docs lang="en-US">
可编辑的定义列表
</docs>

<script setup lang="ts">
import type { ProDescriptionsProps } from '@antdv-next1/pro-components'
import type { VNode } from 'vue'
import { ProDescriptions } from '@antdv-next1/pro-components'
import { Input, Tooltip } from 'antdv-next'
import { h } from 'vue'

async function request() {
  return Promise.resolve({
    success: true,
    data: {
      rate: 4,
      id: 'ORD-2024-0115-0001',
      date: '20240115',
      money: '128000',
      state: 'processing',
      state2: 'open',
      textarea: '客户要求在一季度内完成全部部署上线工作，优先安排专属技术支持团队跟进对接，确保各环节顺利推进并做好验收准备',
    },
  })
}
const columns: ProDescriptionsProps<Record<string, any>, 'text'>['columns'] = [
  {
    title: '订单编号',
    key: 'text',
    dataIndex: 'id',
    copyable: true,
    ellipsis: true,
  },
  {
    title: '订单状态',
    key: 'state',
    dataIndex: 'state',
    valueType: 'select',
    editable: false,
    valueEnum: {
      pending: { text: '待审核', status: 'Warning' },
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
  },
  {
    title: '订单备注',
    key: 'textarea',
    dataIndex: 'textarea',
    valueType: 'textarea',
    formItemProps: {
      style: {
        flex: 1,
      },
    },
  },
  {
    title: '付款状态',
    key: 'state2',
    dataIndex: 'state2',
    formItemRender: () => {
      return h(Input, {
        placeholder: '输入 Success 切换评分方式',
      })
    },
  },
  {
    title: '评分',
    dataIndex: 'fraction',
    valueType: (record) => {
      const scoringMethod = record?.state2
      if (scoringMethod === 'Success')
        return 'select'
      return 'digit'
    },
    fieldProps: {
      mode: 'multiple',
    },
    request: async () =>
      ['优秀', '良好', '一般', '待改进', '不合格'].map((item, index) => ({
        label: item,
        value: index,
      })),
  },
  {
    title: '签约日期',
    key: 'date',
    dataIndex: 'date',
    valueType: 'date',
  },
  {
    title: '满意度',
    key: 'rate',
    dataIndex: 'rate',
    valueType: 'rate',
  },
  {
    title: '合同金额',
    key: 'money',
    dataIndex: 'money',
    valueType: 'money',
    render: (dom, _, _1, action) => {
      return h(Tooltip, {
        title: '点击进入编辑状态',
      }, () => h('div', {
        onClick: () => {
          action?.startEditable?.('money')
        },
      }, dom as VNode))
    },
  },
  {
    title: '操作',
    valueType: 'option',
    render: () => [
      h('a', { target: '_blank', rel: 'noopener noreferrer', key: 'detail' }, '详情'),
      h('a', { target: '_blank', rel: 'noopener noreferrer', key: 'log' }, '日志'),
      h('a', { target: '_blank', rel: 'noopener noreferrer', key: 'track' }, '物流追踪'),
    ],
  },
  {
    dataIndex: 'percent',
    label: '交付进度',
    valueType: 'percent',
    content: 75,
  },
]
</script>

<template>
  <div class="p-6">
    <ProDescriptions
      title="可编辑的订单详情"
      :request="request"
      :editable="{}"
      :columns="columns"
    />
  </div>
</template>

<style scoped></style>
