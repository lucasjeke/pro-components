<docs lang="zh-CN">
卡片边框。
</docs>

<docs lang="en-US">
card border
</docs>

<script setup lang="ts">
import type { ProColumns, ProTableInstance } from '@antdv-next1/pro-components'
import { ProTable } from '@antdv-next1/pro-components'
import { PlusOutlined } from '@antdv-next/icons'
import { Button } from 'antdv-next'
import { h } from 'vue'

const tableRef = useTemplateRef<ProTableInstance<Record<string, any>>>('table')

const valueEnum: Record<number, string> = {
  0: 'close',
  1: 'running',
  2: 'online',
  3: 'error',
}

export interface TableListItem {
  key: number
  name: string
  status: string
  updatedAt: number
  createdAt: number
  progress: number
  money: number
}

const tableListDataSource: TableListItem[] = []

for (let i = 0; i < 5; i += 1) {
  tableListDataSource.push({
    key: i,
    name: `TradeCode ${i}`,
    status: valueEnum[Math.floor(Math.random() * 10) % 4]!,
    updatedAt: Date.now() - Math.floor(Math.random() * 1000),
    createdAt: Date.now() - Math.floor(Math.random() * 2000),
    money: Math.floor(Math.random() * 2000) * i,
    progress: Math.ceil(Math.random() * 100) + 1,
  })
}

const columns: ProColumns<TableListItem>[] = [
  {
    title: '名称',
    dataIndex: 'name',
    render: dom => h('a', {}, dom as VNode),
  },
  {
    title: '状态',
    dataIndex: 'status',
    initialValue: 'all',
    filters: true,
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      close: { text: '关闭', status: 'Default' },
      running: { text: '运行中', status: 'Processing' },
      online: { text: '已上线', status: 'Success' },
      error: { text: '异常', status: 'Error' },
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'date',
  },
  {
    title: '进度',
    dataIndex: 'progress',
    valueType: 'progress',
  },
  {
    title: '金额',
    dataIndex: 'money',
    valueType: 'money',
  },
  {
    title: '操作',
    key: 'option',
    valueType: 'option',
    render: () => [
      h('a', { key: 'link' }, '链路'),
      h('a', { key: 'link2' }, '报警'),
      h('a', { key: 'link3' }, '监控'),
    ],
  },
]
const bordered = shallowRef(false)
</script>

<template>
  <div class="p-6">
    <a-space :style="{ marginBlockEnd: '16px' }">
      <span>卡片边框:</span>
      <a-switch v-model:checked="bordered" />
    </a-space>
    <ProTable
      ref="table"
      :columns="columns"
      :card-bordered="bordered"
      :request="async () => {
        return {
          data: tableListDataSource,
          success: true,
        };
      }"
      row-key="key"
      :search="{
        labelWidth: 'auto',
      }"
      :pagination="{
        pageSize: 5,
      }"
      date-formatter="string"
      header-title="基础表格"
      :tool-bar-render="() => [
        h(Button, {
          key: 'button',
          icon: h(PlusOutlined),
          onClick: () => {
            tableRef?.reload?.();
          },
          type: 'primary',
        }, () => '新建'),
      ]"
    />
  </div>
</template>

<style  scoped>
</style>
