<docs lang="zh-CN">
通过 `itemRender` 自定义每一项的渲染，可基于默认内容 `defaultDom`（`VNode`）进行包装或完全自定义。
</docs>

<docs lang="en-US">
Use `itemRender` to customize each item's rendering. The third argument `defaultDom` is the default list item element (`VNode`); you can wrap it or replace it.
</docs>

<script setup lang="ts">
import { ProListy } from '@antdv-next1/pro-components'
import { Avatar, theme } from 'antdv-next'
import { h } from 'vue'

const APPLICATIONS = [
  {
    id: '1',
    title: '帆软 SSO',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
    description:
      'FineReport 是一款用于报表制作、分析和展示的软件，支持数据填报与可视化大屏。',
  },
  {
    id: '2',
    title: '泛微 E9 SSO',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
    description:
      '泛微 E9 是一款成熟的协同办公软件，以流程管理、知识管理为核心。',
  },
  {
    id: '3',
    title: '销售易',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
    description:
      'SAML (Security Assertion Markup Language) 是一种用于身份认证与授权的标准协议。',
  },
]
const { token } = theme.useToken()
</script>

<template>
  <div class="p-6 bg-[--ant-color-bg-layout]">
    <ProListy
      row-key="id"
      split
      :grid="{
        xs: 1,
        sm: 2,
        md: 2,
        lg: 4,
        xl: 4,
        xxl: 4,
        gutter: [16, 16],
      }"
      :pagination="false"
      :columns="[
        { dataIndex: 'title', listSlot: 'title' },
        { dataIndex: 'avatar', listSlot: 'avatar' },
        { dataIndex: 'description', listSlot: 'description' },
      ]"
      :data-source="APPLICATIONS"
      :toolbar="{
        menu: {
          type: 'tab',
          items: [
            { key: 'all', label: '全部应用' },
            { key: 'dev', label: '开发类' },
            { key: 'ops', label: '运维类' },
            { key: 'office', label: '办公类' },
          ],
        },
      }"
      :item-render="(item) => h('div', {
        style: {
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
          borderRadius: 8,
          padding: '24px',
          height: '100%',
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          background: token.colorBgContainer,
        },
        tabIndex: 0,
      }, h('div', { style: {
             display: 'flex', alignItems: 'flex-start', gap: '12px',
           } },
           [
             h(Avatar, {
               src: item.avatar,
               size: 48,
               shape: 'square',
               style: {
                 flexShrink: 0,
               },
             }),
             h('div', {
               flex: 1, minWidth: 0,
             }, [
               h('div', { style: {
                 fontWeight: 600,
                 fontSize: '16px',
                 marginBottom: '4px',
               } }, item.title),
               h('div', {
                 style: {
                   color: token.colorTextSecondary,
                   fontSize: '14px',
                   lineHeight: 1.5,
                   overflow: 'hidden',
                   textOverflow: 'ellipsis',
                   display: '-webkit-box',
                   WebkitLineClamp: 2,
                   WebkitBoxOrient: 'vertical',
                 },
               }, item.description),
             ]),
           ],
      ))"
    />
  </div>
</template>

<style scoped></style>
