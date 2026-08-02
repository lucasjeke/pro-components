<docs lang="zh-CN">
这里展示在实际 AiDesk 中图像算法选择的使用示例。
</docs>

<docs lang="en-US">
这里展示在实际 AiDesk 中图像算法选择的使用示例。
</docs>

<script setup lang="ts">
import { ProCheckCardGroup } from '@antdv-next1/pro-components'
import { Avatar } from 'antdv-next'
import { h } from 'vue'

const dataSource = [
  {
    title: '图像分类',
    avatar: h(Avatar, {
      size: 32,
      shape: 'square',
      src: 'https://gw.alipayobjects.com/zos/bmw-prod/ae0adacf-9456-4ed3-b1ab-51e4417d8d0c.svg',
    }),
    description: '这是一段关于该算法的说明',
    value: 'A',
  },
  {
    title: '物体检测',
    avatar: h(Avatar, {
      size: 32,
      shape: 'square',
      src: 'https://gw.alipayobjects.com/zos/bmw-prod/ae0adacf-9456-4ed3-b1ab-51e4417d8d0c.svg',
    }),
    description: '这是一段关于该算法的说明',
    value: 'B',
  },
  {
    title: 'OCR自定义',
    avatar: h(Avatar, {
      size: 32,
      shape: 'square',
      src: 'https://gw.alipayobjects.com/zos/bmw-prod/ae0adacf-9456-4ed3-b1ab-51e4417d8d0c.svg',
    }),
    description: '这是一段关于该算法的说明',
    value: 'C',
  },
  {
    title: 'OCR',
    avatar: h(Avatar, {
      size: 32,
      shape: 'square',
      src: 'https://gw.alipayobjects.com/zos/bmw-prod/ae0adacf-9456-4ed3-b1ab-51e4417d8d0c.svg',
    }),
    description: '这是一段关于该算法的说明',
    value: 'D',
  },
  {
    title: '视频分类',
    avatar: h(Avatar, {
      size: 32,
      shape: 'square',
      src: 'https://gw.alipayobjects.com/zos/bmw-prod/ae0adacf-9456-4ed3-b1ab-51e4417d8d0c.svg',
    }),
    description: '这是一段关于该算法的说明',
    value: 'E',
  },
  {
    title: '关键点检测',
    avatar: h(Avatar, {
      size: 32,
      shape: 'square',
      src: 'https://gw.alipayobjects.com/zos/bmw-prod/ae0adacf-9456-4ed3-b1ab-51e4417d8d0c.svg',
    }),
    description: '这是一段关于该算法的说明',
    value: 'F',
  },
]
</script>

<template>
  <div :style="{ padding: '24px', backgroundColor: '#f7f8fa' }">
    <ProCheckCardGroup :options="dataSource" />
  </div>
</template>

<style  scoped></style>
