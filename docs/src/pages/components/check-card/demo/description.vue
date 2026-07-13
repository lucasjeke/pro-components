<docs lang="zh-CN">
描述区域可通过 `description` 自定义 Vue 节点。
</docs>

<docs lang="en-US">
描述区域可通过 `description` 自定义 Vue 节点。
</docs>

<script setup lang="ts">
import { ProCheckCard } from '@antdv-next1/pro-components'
import { TypographyParagraph } from 'antdv-next'
import { h } from 'vue'
</script>

<template>
  <ProCheckCard
    avatar="https://gw.alipayobjects.com/zos/bmw-prod/f601048d-61c2-44d0-bf57-ca1afe7fd92e.svg"
    title="默认描述区域不会进行折行"
    :description="
      h('span', null, [
        '选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念。',
        h(
          'a',
          {
            onClick: (e) => {
              e.stopPropagation()
            },
          },
          '查看详情',
        ),
      ])
    "
  />
  <ProCheckCard
    avatar="https://gw.alipayobjects.com/zos/bmw-prod/f601048d-61c2-44d0-bf57-ca1afe7fd92e.svg"
    title="你可以通过排版组件进行省略"
    :description="
      h(
        TypographyParagraph,
        {
          ellipsis: {
            rows: 2,
          },
        },
        () => '选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念。',
      )
    "
  />
</template>

<style scoped></style>
