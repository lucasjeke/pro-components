<docs lang="zh-CN">
一些预设的模式
</docs>

<docs lang="en-US">
Some preset modes
</docs>

<script setup lang="ts">
import type { Key } from '@antdv-next1/pro-components'
import { ProListy } from '@antdv-next1/pro-components'
import { EllipsisOutlined } from '@antdv-next/icons'
import { Button, Divider, Progress, Space, Tag } from 'antdv-next'
import { h } from 'vue'

const types = ['top', 'inline', 'new']
const data = [
  '智慧零售平台（top）',
  'Ant Design Pro（inline）',
  '云原生微服务框架（new）',
  '数据可视化引擎',
].map((item, index) => ({
  title: item,
  subTitle: h(Tag, { color: '#5BD8A6' }, () => '技术专栏'),
  actions: h(Space, {
    align: 'center',
    size: 0,
    separator: h(Divider, { orientation: 'vertical' }),
  }, () => [
    h('a', { key: 'invite' }, '邀请'),
    h('a', { key: 'operate' }, '操作'),
    h('a', { key: 'rest' }, h(EllipsisOutlined)),
  ]),
  description: h('div', null, [
    h('div', null, 'top 会有小角标'),
    h('div', null, 'inline 标题字体是 normal'),
    h('div', null, 'new 会有一个入场动画'),
  ]),
  type: types[index],
  avatar:
    'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
  content: h('div', {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  }, h('div', { style: { width: '200px' } }, [
    h('div', null, '发布中'),
    h(Progress, { percent: 80 }),
  ])),
}))
const expandedRowKeys = shallowRef<readonly Key[]>([])
const selectedRowKeys = shallowRef<Key[]>([])
const dataSource = shallowRef<any[]>([...data] as any[])
function handleRefresh() {
  dataSource.value = [...data.map(item => ({ ...item }))]
  setTimeout(() => {
    const list = [...data.map(item => ({ ...item }))]
    list[1]!.type = 'new'
    dataSource.value = list
  }, 0)
}
</script>

<template>
  <div class="p-6">
    <ProListy
      :columns="[
        { dataIndex: 'title', listSlot: 'title' },
        { dataIndex: 'subTitle', listSlot: 'subTitle' },
        { dataIndex: 'type', listSlot: 'type' },
        { dataIndex: 'description', listSlot: 'description' },
        { dataIndex: 'avatar', listSlot: 'avatar' },
        { dataIndex: 'content', listSlot: 'content' },
        { dataIndex: 'actions', listSlot: 'actions' },
      ]"
      :tool-bar-render="() => [
        h(Button, { key: 3,
                    type: 'primary',
                    onClick: handleRefresh }, () => '刷新'),
      ]"
      row-key="title"
      header-title="预设的列状态"
      :row-selection="{
        selectedRowKeys,
        onChange: (keys: Key[]) => selectedRowKeys = keys,
      }"
      :data-source="dataSource"
      :expandable="{
        expandedRowKeys,
        onExpandedRowsChange: (keys) => {
          expandedRowKeys = keys
        },
      }"
    />
  </div>
</template>

<style scoped></style>
