<docs lang="zh-CN">
 同一份 `columns` 同时传给 ProTable 和 ProList，通过切换组件即可在表格和列表视图之间无缝切换。
</docs>

<docs lang="en-US">
Use the same `columns` for both ProTable and ProList. Switch between table and list views seamlessly by toggling the component.
</docs>

<script setup lang="ts">
import type { ProColumns } from '@antdv-next1/pro-components'
import { ProListy, ProTable } from '@antdv-next1/pro-components'
import { Divider, Space, Tag } from 'antdv-next'

interface DataItem {
  id: string
  name: string
  avatar: string
  status: 'open' | 'closed' | 'processing'
  labels: string[]
  updatedAt: string
}
const dataSource: DataItem[] = [
  {
    id: '1',
    name: '智慧零售平台',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    status: 'open',
    labels: ['技术专栏', '设计语言'],
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Ant Design',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    status: 'processing',
    labels: ['Ant Design'],
    updatedAt: '2024-02-20',
  },
  {
    id: '3',
    name: '云原生微服务框架',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    status: 'closed',
    labels: ['云原生', '可视化'],
    updatedAt: '2024-03-10',
  },
]

/**
 * 这份 columns 同时用于 ProTable 和 ProList
 * - ProTable 渲染为表格列
 * - ProList 通过 listSlot 映射到列表项各部分
 */
const columns: ProColumns<DataItem>[] = [
  {
    title: '名称',
    dataIndex: 'name',
    listSlot: 'title',
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    listSlot: 'avatar',
    search: false,
    hideInTable: true,
  },
  {
    title: '标签',
    dataIndex: 'labels',
    listSlot: 'subTitle',
    search: false,
    render: (_, row) => h(Space, { size: 4 }, () => row.labels?.map(label => h(Tag, { color: 'blue', key: label }, () => label))),
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: {
      open: { text: '未解决', status: 'Error' },
      closed: { text: '已解决', status: 'Success' },
      processing: { text: '处理中', status: 'Processing' },
    },
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    valueType: 'date',
    search: false,
    listSlot: 'description',
  },
  {
    title: '操作',
    valueType: 'option',
    listSlot: 'actions',
    key: 'option',
    render: () => h(Space, {
      align: 'center',
      size: 0,
      separator: h(Divider, { orientation: 'vertical' }),
    }, () => [h('a', { key: 'edit' }, '编辑'), h('a', { key: 'delete' }, '删除')]),
  },
]
const viewMode = shallowRef<'list' | 'table'>('list')
</script>

<template>
  <div class="p-6">
    <a-radio-group
      v-model:value="viewMode"
      option-type="button"
      button-style="solid"
      :options="[
        { label: '列表视图', value: 'list' },
        { label: '表格视图', value: 'table' },
      ]"
      :style="{ marginBottom: '16px' }"
    />
    <ProListy
      v-if="viewMode === 'list'"
      row-key="id"
      header-title="列表视图"
      :columns="columns"
      :data-source="dataSource"
    />
    <ProTable
      v-else
      row-key="id"
      header-title="表格视图"
      :columns="columns"
      :data-source="dataSource"
      :search="false"
      :pagination="false"
    />
  </div>
</template>

<style scoped></style>
