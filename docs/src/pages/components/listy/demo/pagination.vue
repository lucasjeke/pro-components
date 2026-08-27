<docs lang="zh-CN">
 翻页
</docs>

<docs lang="en-US">
  pagination
</docs>

<script setup lang="ts">
import { ProListy } from '@antdv-next1/pro-components'
import { EllipsisOutlined } from '@antdv-next/icons'
import { Divider, Progress, Space, Tag } from 'antdv-next'

const data = [
  '智慧零售平台',
  'Ant Design Pro',
  '云原生微服务框架',
  '数据可视化引擎',
  '智能客服系统',
  'DevOps 工具链',
  '统一权限管理中心',
].map(item => ({
  title: item,
  subTitle: h(Tag, { color: '#5BD8A4' }, () => '技术专栏'),
  actions: h(Space, {
    align: 'center',
    size: 0,
    separator: h(Divider, { orientation: 'vertical' }),
  }, () => [
    h('a', { key: 'invite' }, '邀请'),
    h('a', { key: 'operate' }, '操作'),
    h('a', { key: 'rest' }, h(EllipsisOutlined)),
  ]),
  avatar:
    'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
  content: h('div', { style: { flex: 1, dislay: 'flex', justifyContent: 'flex-end' } }, [
    h('div', { style: { width: 200 } }, [
      h('div', null, '发布中'),
      h(Progress, { percent: 80 }),
    ]),
  ]),
}))
</script>

<template>
  <div class="p-6">
    <ProListy
      :pagination="{
        defaultPageSize: 5,
        showSizeChanger: true,
      }"
      :row-key="(item) => item.title"
      :columns="[
        { dataIndex: 'title', listSlot: 'title' },
        { dataIndex: 'subTitle', listSlot: 'subTitle' },
        { dataIndex: 'type', listSlot: 'type' },
        { dataIndex: 'avatar', listSlot: 'avatar' },
        { dataIndex: 'content', listSlot: 'content' },
        { dataIndex: 'actions', listSlot: 'actions' },
      ]"
      header-title="翻页"
      :data-source="data"
    />
  </div>
</template>

<style scoped></style>
