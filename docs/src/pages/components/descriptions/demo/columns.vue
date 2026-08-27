<docs lang="zh-CN">
通过请求接口数据和 columns 来展示定义列表
</docs>

<docs lang="en-US">
Display the definition list by requesting interface data and columns
</docs>

<script setup lang="ts">
import type { ProDescriptionsItemProps } from '@antdv-next1/pro-components'
import { ProDescriptions } from '@antdv-next1/pro-components'
import { h } from 'vue'

async function request() {
  return Promise.resolve({
    success: true,
    data: {
      date: '20200809',
      money: '1212100',
      money2: -12345.33,
      state: 'all',
      switch: true,
      state2: 'open',
    },
  })
}
const columns: ProDescriptionsItemProps<Record<string, any>, 'text'>[] = [{
  title: '文本',
  key: 'text',
  dataIndex: 'id',
}, {
  title: '状态',
  key: 'state',
  dataIndex: 'state',
  valueType: 'select',
  valueEnum: {
    all: { text: '全部', status: 'Default' },
    open: {
      text: '未解决',
      status: 'Error',
    },
    closed: {
      text: '已解决',
      status: 'Success',
    },
  },
}, {
  title: '状态2',
  key: 'state2',
  dataIndex: 'state2',
}, {
  title: '时间',
  key: 'date',
  dataIndex: 'date',
  valueType: 'date',
}, {
  title: '时间（自定义格式）',
  key: 'date-formatted',
  dataIndex: 'date',
  valueType: 'date',
  fieldProps: {
    format: 'DD.MM.YYYY',
  },
}, {
  title: '开关',
  key: 'switch',
  dataIndex: 'switch',
  valueType: 'switch',
}, {
  title: 'money',
  key: 'money',
  dataIndex: 'money',
  valueType: 'money',
  fieldProps: {
    moneySymbol: '$',
  },
}, {
  title: 'money无符号',
  key: 'money-no-symbol',
  dataIndex: 'money',
  valueType: 'money',
  fieldProps: {
    moneySymbol: false,
  },
}, {
  title: 'money负数无符号',
  key: 'money2',
  dataIndex: 'money2',
  valueType: 'money',
  fieldProps: {
    moneySymbol: false,
  },
}, {
  title: '操作',
  valueType: 'option',
  render: () => [
    h('a', {
      target: '_blank',
      rel: 'noopener noreferrer',
      key: 'link',
    }, '链路'),
    h('a', {
      target: '_blank',
      rel: 'noopener noreferrer',
      key: 'warning',
    }, '报警'),
    h('a', {
      target: '_blank',
      rel: 'noopener noreferrer',
      key: 'view',
    }, '查看'),
  ],
}, {
  dataIndex: 'percent',
  label: '百分比',
  valueType: 'percent',
  content: 100,
}, {
  title: '多余节点',
  render: () => h('div', null, '多余的dom'),
}, {
  label: '超链接',
  content: h('a', { href: 'alipay.com' }, '超链接'),
}]
</script>

<template>
  <div class="p-6">
    <ProDescriptions
      title="高级定义列表 request columns"
      :request="request"
      empty-text="空"
      :columns="columns"
    />
  </div>
</template>

<style  scoped>
</style>
