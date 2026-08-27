<docs lang="zh-CN">
ProDescriptions 支持了和 Table 相同的 dataSource
</docs>

<docs lang="en-US">
ProDescriptions supports the same dataSource as Table
</docs>

<script setup lang="ts">
import type { ProDescriptionsItemProps } from '@antdv-next1/pro-components'
import { ProDescriptions } from '@antdv-next1/pro-components'
import { h } from 'vue'

const columns: ProDescriptionsItemProps<Record<string, any>, 'text'>[] = [{
  title: '文本',
  key: 'text',
  dataIndex: 'id',
  ellipsis: true,
  copyable: true,
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
  title: 'money',
  key: 'money',
  dataIndex: 'money',
  valueType: 'money',
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
  label: '百分比',
  valueType: 'percent',
  content: 100,
}]
</script>

<template>
  <div class="p-6">
    <ProDescriptions
      title="dataSource and items" :data-source="{
        id: '这是一段文本columns',
        date: '20200809',
        money: '1212100',
        state: 'all',
        state2: 'open',
      }"
      :columns="columns"
    />
  </div>
</template>

<style scoped></style>
