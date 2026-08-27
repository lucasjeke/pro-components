<docs lang="zh-CN">
 竖排样式
</docs>

<docs lang="en-US">
Vertical style
</docs>

<script setup lang="ts">
import { ProListy } from '@antdv-next1/pro-components'
import { LikeOutlined, MessageOutlined, StarOutlined } from '@antdv-next/icons'
import { Button, Space, Tag } from 'antdv-next'
import { h } from 'vue'

const dataSource = [
  {
    title: '智慧零售平台',
  },
  {
    title: 'Ant Design',
  },
  {
    title: '云原生微服务框架',
  },
  {
    title: '数据可视化引擎',
  },
]
function IconText({ icon, text }: { icon: any, text: string }) {
  return h(Space, null, [
    h(icon),
    text,
  ])
}
</script>

<template>
  <div class="p-6">
    <ProListy
      :tool-bar-render="() => [h(Button, { type: 'primary', key: 3 }, () => '新建')]"
      item-layout="vertical"
      row-key="title"
      header-title="竖排样式"
      :data-source="dataSource"
      :columns="[
        { dataIndex: 'title', listSlot: 'title' },
        {
          listSlot: 'description',
          render: () => h(Space, {
            orientation: 'horizontal',
          }, () => [
            h(Tag, null, () => '技术专栏'),
            h(Tag, null, () => '设计语言'),
            h(Tag, null, () => '云原生'),
          ]),
        },
        {
          listSlot: 'actions',
          render: () => [
            h(IconText, {
              icon: StarOutlined,
              text: '156',
              key: 'star',
            }),
            h(IconText, {
              icon: LikeOutlined,
              text: '156',
              key: 'like',
            }),
            h(IconText, {
              icon: MessageOutlined,
              text: '2',
              key: 'message',
            }),
          ],
        },
        {
          listSlot: 'aside',
          render: () => h('img', {
            style: {
              width: '272px',

            },
            alt: 'logo',
            src: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
          }),
        },
        {
          listSlot: 'content',
          render: () => h('div', null, '面向企业级中后台的数据可视化解决方案，以最小的接入成本提供丰富的图表类型与交互能力，助力业务快速搭建数据看板与分析报表。'),
        },
      ]"
    />
  </div>
</template>

<style scoped></style>
