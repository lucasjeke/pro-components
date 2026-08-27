<docs lang="zh-CN">
 大小和分割线
</docs>

<docs lang="en-US">
 Size and divider
</docs>

<script setup lang="ts">
import type { Key } from '@antdv-next1/pro-components'
import { ProListy } from '@antdv-next1/pro-components'
import { Button, Progress, Tag } from 'antdv-next'
import { h } from 'vue'

interface ProjectItem {
  title: string
  avatar: string
  description: string
  progress: number
  status: string
}
const dataSource: ProjectItem[] = [
  {
    title: '智慧零售平台',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    description: '面向线下门店的数字化经营解决方案',
    progress: 85,
    status: '开发中',
  },
  {
    title: 'Ant Design Pro',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    description: '开箱即用的中台前端解决方案',
    progress: 100,
    status: '已上线',
  },
  {
    title: '云原生微服务框架',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    description: '基于 K8s 的微服务开发与治理框架',
    progress: 92,
    status: '测试中',
  },
  {
    title: '数据可视化引擎',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    description: '企业级数据看板与图表分析工具',
    progress: 60,
    status: '开发中',
  },
]
const selectedRowKeys = shallowRef<Key[]>([])
const expandedRowKeys = shallowRef<readonly Key[]>([])
const size = shallowRef<'small' | 'default' | 'large' | undefined>(
  'default',
)
const split = shallowRef<0 | 1>(1)
</script>

<template>
  <div class="p-6">
    <a-space>
      大小：
      <a-select
        v-model:value="size"
        :style="{
          width: '100px',
        }"
        :options="['small', 'default', 'large'].map((selectSize) => ({
          value: selectSize,
          label: selectSize,
        }))"
      />
      分割线：
      <a-select
        v-model:value="split"
        :style="{
          width: '100px',
        }"
        :options="[
          { value: 1, label: '有' },
          { value: 0, label: '无' },
        ]"
      />
    </a-space>

    <ProListy
      :size="size"
      :split="split === 1"
      :tool-bar-render="() => [
        h(Button, { key: 'new', type: 'primary' }, () => '新建'),
      ]"
      :columns="[
        { dataIndex: 'title', listSlot: 'title' },
        { dataIndex: 'description', listSlot: 'description' },
        { dataIndex: 'avatar', listSlot: 'avatar' },
        {
          listSlot: 'content',
          render: (_, record) => h('div', {
            minWidth: '200px',
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
          }, h('div', { style: {
            width: '200px',
          } }, [
            h('div', null, [
              record.status,
              h(Tag, { color: record.progress === 100 ? 'success' : 'processing' }, () => `${record.progress}%`),
            ]),
            h(Progress, {
              percent: record.progress,
              showInfo: false,
            }),
          ])),
        },
        {
          listSlot: 'actions',
          render: () => h('a', { key: 'invite' }, '邀请'),
        },
      ]"
      :expandable="{
        expandedRowKeys,
        defaultExpandAllRows: false,
        onExpandedRowsChange: (keys) => expandedRowKeys = keys,
      }"
      row-key="title"
      header-title="大小和分割线"
      :row-selection="{
        selectedRowKeys,
        onChange: (keys: Key[]) => selectedRowKeys = keys,
      }"
      :data-source="dataSource"
    />
  </div>
</template>

<style scoped></style>
