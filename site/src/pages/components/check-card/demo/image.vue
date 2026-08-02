<docs lang="zh-CN">
通过仅仅配置 `cover` 属性可以让你的选项成为一个纯图片选项。
</docs>

<docs lang="en-US">
通过仅仅配置 `cover` 属性可以让你的选项成为一个纯图片选项。
</docs>

<script setup lang="ts">
import { ProCheckCard } from '@antdv-next1/pro-components'
import { h } from 'vue'
</script>

<template>
  <ProCheckCard
    :cover="
      h('img', {
        alt: 'example',
        height: '240px',
        src: 'https://gw.alipayobjects.com/mdn/rms_66ee3f/afts/img/A*FyH5TY53zSwAAAAAAAAAAABkARQnAQ',
      })
    "
  />
  <ProCheckCard
    cover="https://gw.alipayobjects.com/mdn/rms_66ee3f/afts/img/A*FyH5TY53zSwAAAAAAAAAAABkARQnAQ"
  />
</template>

<style scoped></style>
