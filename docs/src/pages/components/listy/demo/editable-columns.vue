<docs lang="zh-CN">
  可编辑列表（columns）
</docs>

<docs lang="en-US">
 Editable list (columns)
</docs>

<script setup lang="ts">
import type { ProColumns } from '@antdv-next1/pro-components'
import { ProListy } from '@antdv-next1/pro-components'
import { Space, Tag, theme } from 'antdv-next'

const { token } = theme.useToken()
const defaultData = [
  {
    id: '1',
    name: '智慧零售平台',
    image:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    desc: '我是一条测试的描述',
  },
  {
    id: '2',
    name: 'Ant Design',
    image:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    desc: '我是一条测试的描述',
  },
  {
    id: '3',
    name: '云原生微服务框架',
    image:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    desc: '我是一条测试的描述',
  },
]
type DataItem = (typeof defaultData)[number]

const columns: ProColumns<DataItem>[] = [
  {
    title: '名称',
    dataIndex: 'name',
    listSlot: 'title',
  },
  {
    dataIndex: 'image',
    listSlot: 'avatar',
    editable: false,
  },
  {
    title: '描述',
    dataIndex: 'desc',
    listSlot: 'description',
  },
  {
    listSlot: 'subTitle',
    search: false,
    editable: false,
    render: () => h(Space, { size: 8 }, () => [h(Tag, { color: token.value.colorPrimary }, () => 'Ant Design'), h(Tag, { color: token.value.colorSuccess }, () => '可视化')]),
  },
  {
    listSlot: 'actions',
    search: false,
    render: (_, row, __, action) => [
      h('a', { onClick: () => action?.startEditable?.(row.id), key: 'edit' }, '编辑'),
    ],
  },
]
const dataSource = shallowRef<DataItem[]>(defaultData)
</script>

<template>
  <div class="p-6">
    <ProListy
      row-key="id"
      header-title="可编辑列表（columns API）"
      :data-source="dataSource"
      :editable="{
        onSave: async (key, record, originRow) => {
          console.log(key, record, originRow);
          return true;
        },
      }"
      :columns="columns"
      @data-source-change="(_dataSource) => dataSource = _dataSource"
    />
  </div>
</template>

<style scoped></style>
