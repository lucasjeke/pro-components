<docs lang="zh-CN">
你可以通过 `title` 属性自定义标题区域。
</docs>

<docs lang="en-US">
你可以通过 `title` 属性自定义标题区域。
</docs>

<script setup lang="ts">
import { ProCheckCard } from '@antdv-next1/pro-components'
import { AppstoreOutlined } from '@antdv-next/icons'
import { Tag } from 'antdv-next'
import { h } from 'vue'
</script>

<template>
  <ProCheckCard
    :title="
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
          },
        },
        [
          h(AppstoreOutlined),
          h(
            'span',
            {
              style: {
                marginInlineEnd: '8px',
                marginInlineStart: '8px',
              },
            },
            '示例',
          ),
          h(Tag, { color: 'blue' }, () => 'blue'),
        ],
      )
    "
    description="选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念"
  />

  <ProCheckCard
    title="标题内容过长会自动进行省略，标题内容过长会自动进行省略"
    description="选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念"
  />
</template>

<style scoped></style>
