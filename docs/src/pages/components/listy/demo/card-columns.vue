<docs lang="zh-CN">
  卡片列表
</docs>

<docs lang="en-US">
 card list
</docs>

<script setup lang="ts">
import type { ProColumns } from '@antdv-next1/pro-components'
import { ProListy } from '@antdv-next1/pro-components'
import { Tag, theme } from 'antdv-next'
import { h } from 'vue'

interface DataItem {
  id: string
  title: string
  category: string
  description: string
  avatar: string
  downloads: number
  rating: number
  status: 'stable' | 'beta' | 'deprecated'
}

const statusConfig = {
  stable: { text: '稳定版', color: 'success' },
  beta: { text: '测试版', color: 'processing' },
  deprecated: { text: '已废弃', color: 'default' },
}
const { token } = theme.useToken()
const data: DataItem[] = [
  {
    id: '1',
    title: 'ProTable',
    category: '表格组件',
    description: '高级表格组件，支持搜索、筛选、排序等功能',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
    downloads: 125000,
    rating: 4.8,
    status: 'stable',
  },
  {
    id: '2',
    title: 'ProForm',
    category: '表单组件',
    description: '高级表单组件，简化表单开发流程',
    avatar:
      'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    downloads: 98000,
    rating: 4.9,
    status: 'stable',
  },
  {
    id: '3',
    title: 'ProLayout',
    category: '布局组件',
    description: '开箱即用的中后台布局方案',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
    downloads: 156000,
    rating: 4.7,
    status: 'stable',
  },
  {
    id: '4',
    title: 'ProCard',
    category: '卡片组件',
    description: '可分割的卡片组件，支持多种布局',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg',
    downloads: 67000,
    rating: 4.6,
    status: 'stable',
  },
  // {
  //   id: '5',
  //   title: 'ProDescriptions',
  //   category: '描述列表',
  //   description: '高级描述列表组件，支持编辑和请求',
  //   avatar:
  //     'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
  //   downloads: 45000,
  //   rating: 4.5,
  //   status: 'stable',
  // },
  {
    id: '6',
    title: 'ProList',
    category: '列表组件',
    description: '高级列表组件，支持多种展示模式',
    avatar:
   'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    downloads: 52000,
    rating: 4.7,
    status: 'stable',
  },
  // {
  //   id: '7',
  //   title: 'ProSkeleton',
  //   category: '骨架屏',
  //   description: '高级骨架屏组件，更好的加载体验',
  //   avatar:
  //     'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
  //   downloads: 34000,
  //   rating: 4.4,
  //   status: 'beta',
  // },
  {
    id: '8',
    title: 'ProField',
    category: '字段组件',
    description: '统一的字段渲染组件',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg',
    downloads: 28000,
    rating: 4.3,
    status: 'stable',
  },
]
const columns: ProColumns<DataItem>[] = [
  {
    title: '组件名称',
    dataIndex: 'title',
    listSlot: 'title',
  },
  {
    title: '状态',
    dataIndex: 'status',
    listSlot: 'subTitle',
    render: (_, record) => h(Tag, { color: statusConfig[record.status].color }, () => statusConfig[record.status].text),

  },
  {
    title: '图标',
    dataIndex: 'avatar',
    listSlot: 'avatar',
  },
  {
    title: '内容',
    listSlot: 'content',
    render: (_, record) => h('div', { style: { flex: 1 } }, [
      h('div', { style: { color: token.value.colorText, marginBottom: '8px' } }, record.description),
      h('div', { style: { fontSize: '12px' } }, ` ${record.category} • ${(record.downloads / 1000).toFixed(1)}K 下载 • ⭐ ${record.rating}`),
    ]),

  },
  {
    title: '操作',
    listSlot: 'actions',
    render: () => [h('a', { key: 'install' }, '安装'), h('a', { key: 'docs' }, '文档')],
  },
]
</script>

<template>
  <div class="bg-#eee">
    <a-alert
      title="推荐使用 columns + listSlot API"
      description="新的 columns API 与 ProTable 保持一致，通过 listSlot 指定数据在列表项中的位置。。"
      type="info"
      show-icon
      :style="{ marginBottom: '16px' }"
    />
    <ProListy
      :pagination="{ defaultPageSize: 8, showSizeChanger: false }"
      :row-selection="{ }"
      :grid="{ gutter: [16, 16], column: 2 }"
      :card-props="{
        styles: {
          body: {
            paddingBlockEnd: 0,
          },
        },
      }"
      :columns="columns"
      header-title="卡片列表（columns API）"
      :data-source="data"
    />
  </div>
</template>

<style scoped></style>
