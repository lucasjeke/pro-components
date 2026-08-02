<docs lang="zh-CN">
 基本使用
</docs>

<docs lang="en-US">
Basic use
</docs>

<script setup lang="ts">
import type { ProColumns } from '@antdv-next1/pro-components'
import { ProListy } from '@antdv-next1/pro-components'
import { Avatar, Divider, Space, Tag } from 'antdv-next'
import { h } from 'vue'

interface ProjectItem {
  id: string
  name: string
  description: string
  status: 'active' | 'archived' | 'pending'
  owner: {
    name: string
    avatar: string
  }
  tags: string[]
  updatedAt: string
}

const statusMap = {
  active: { text: '进行中', color: 'success' },
  archived: { text: '已归档', color: 'default' },
  pending: { text: '待启动', color: 'warning' },
}
const dataSource: ProjectItem[] = [
  {
    id: '1',
    name: 'Ant Design Pro',
    description: '开箱即用的中台前端/设计解决方案',
    status: 'active',
    owner: {
      name: '书琰',
      avatar:
        'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    },
    tags: ['React', 'TypeScript', 'Ant Design'],
    updatedAt: '2024-02-09',
  },
  {
    id: '2',
    name: 'ProComponents',
    description: '专业级别的中后台组件库',
    status: 'active',
    owner: {
      name: '逄一',
      avatar:
        'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    },
    tags: ['React', 'Components'],
    updatedAt: '2024-02-08',
  },
  {
    id: '3',
    name: 'UmiJS',
    description: '插件化的企业级前端应用框架',
    status: 'active',
    owner: {
      name: '期贤',
      avatar:
        'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    },
    tags: ['Framework', 'React'],
    updatedAt: '2024-02-07',
  },
  {
    id: '4',
    name: 'Ant Design Mobile',
    description: '移动端设计规范和组件库',
    status: 'pending',
    owner: {
      name: '玄霜',
      avatar:
        'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    },
    tags: ['Mobile', 'React'],
    updatedAt: '2024-02-06',
  },
  {
    id: '5',
    name: 'Ant Design Charts',
    description: '简单好用的 React 图表库',
    status: 'archived',
    owner: {
      name: '怀渊',
      avatar:
        'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    },
    tags: ['Charts', 'Visualization'],
    updatedAt: '2024-02-05',
  },
]
const columns: ProColumns<ProjectItem>[] = [
  {
    title: '项目名称',
    dataIndex: 'name',
    listSlot: 'title',
  },
  {
    title: '描述',
    dataIndex: 'description',
    listSlot: 'description',
  },
  {
    title: '负责人',
    dataIndex: ['owner', 'avatar'],
    listSlot: 'avatar',
    render: (_, record) => h(Avatar, { src: record.owner.avatar, alt: record.owner.name }),
  },
  {
    title: '状态',
    dataIndex: 'status',
    listSlot: 'subTitle',
    render: (_, record) => h(Tag, {
      color: statusMap[record.status].color,
    }, () => statusMap[record.status].text),
  },
  {
    title: '标签',
    dataIndex: 'tags',
    listSlot: 'content',
    render: (_, record) => h(Space, { size: 4, wrap: true }, () => record.tags.map(tag => (
      h(Tag, { key: tag }, () => tag)
    ))),
  },
  {
    title: '操作',
    listSlot: 'actions',
    render: () =>
      h(Space, {
        align: 'center',
        size: 0,
        separator: h(Divider, { orientation: 'vertical' }),
      }, () => [
        h('a', { key: 'view' }, '查看'),
        h('a', { key: 'edit' }, '编辑'),
      ]),
  },
]
</script>

<template>
  <div class="p-6">
    <ProListy
      :columns="columns"
      :data-source="dataSource"
      row-key="id"
      virtual
      header-title="项目列表"
      tooltip="这是一个基础的列表示例，展示了 ProList 的基本用法"
    />
  </div>
</template>

<style scoped></style>
