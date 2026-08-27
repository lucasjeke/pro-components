<docs lang="zh-CN">
 支持选中的列表
</docs>

<docs lang="en-US">
 List with row selection
</docs>

<script setup lang="ts">
import type { Key } from '@antdv-next1/pro-components'
import { ProListy } from '@antdv-next1/pro-components'
import { Button, Progress } from 'antdv-next'
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
const selectedRowKeys = shallowRef<Key[]>([])
</script>

<template>
  <div class="p-6">
    <ProListy
      :tool-bar-render="() => [h(Button, { key: '3', type: 'primary' }, () => '新建')]"
      :columns="[
        { dataIndex: 'title', listSlot: 'title' },
        {
          listSlot: 'description',
          render: () => '面向企业级中后台的设计解决方案',
        },
        { dataIndex: 'avatar', listSlot: 'avatar' },
        {
          listSlot: 'content',
          render: () => h('div', {
            style: {
              width: '200px',
            },
          }, [h('div', null, '发布中'),
              h(Progress, { percent: 80 }),
          ]),
        },
        {
          listSlot: 'actions',
          render: () => [
            h('a', { key: 'init' }, '邀请'),
            h(Button, { key: 'publish', type: 'text' }, () => '发布'),
          ],
        },
      ]"
      row-key="title"
      header-title="支持选中的列表"
      :row-selection="{
        selectedRowKeys,
        onChange: (keys: Key[]) => selectedRowKeys = keys,
      }"
      :data-source="dataSource"
    />
  </div>
</template>

<style scoped></style>
