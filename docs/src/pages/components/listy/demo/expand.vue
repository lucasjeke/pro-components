<docs lang="zh-CN">
支持展开的列表
</docs>

<docs lang="en-US">
Support for expanded lists
</docs>

<script setup lang="ts">
import type { Key } from '@antdv-next1/pro-components'
import { ProListy } from '@antdv-next1/pro-components'
import { Button, Progress, Space, Tag } from 'antdv-next'
import { h } from 'vue'

const dataSource = [
  {
    title: '智慧零售平台',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
  },
  {
    title: 'Ant Design',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
  },
  {
    title: '云原生微服务框架',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
  },
  {
    title: '数据可视化引擎',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
  },
]
const expandedRowKeys = shallowRef<readonly Key[]>([])
</script>

<template>
  <div class="p-6">
    <ProListy
      row-key="title"
      header-title="支持展开的列表"
      :tool-bar-render="() => [
        h(Button, { key: '3', type: 'primary' }, () => '新建'),
      ]"
      :expandable="{
        expandedRowKeys,
        onExpandedRowsChange: (_expandedKeys) => {
          expandedRowKeys = _expandedKeys
        },
      }"
      :data-source="dataSource"
      :columns="[
        { dataIndex: 'title', listSlot: 'title' },
        {
          listSlot: 'subTitle',
          render: () => h(Space, { size: 8 }, () => [
            h(Tag, { color: 'blue' }, () => 'Ant Design'),
            h(Tag, { color: '#5BD8A6' }, () => '可视化'),
          ]),
        },
        {
          listSlot: 'description',
          render: () => '面向企业级中后台的设计解决方案',
        },
        {
          dataIndex: 'avatar', listSlot: 'avatar',
        },
        {
          listSlot: 'content',
          render: () => h('div', {
            style: {
              minWidth: '200px',
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-end',
            },
          }, h('div', {
            style: {
              width: '200px',
            },
          }, [
            h('div', null, '发布中'),
            h(Progress, { percent: 80 }),
          ])),
        },
        {
          listSlot: 'actions',
          render: () => h('a', { key: 'invite' }, '邀请'),
        },
      ]"
    />
  </div>
</template>

<style scoped></style>
