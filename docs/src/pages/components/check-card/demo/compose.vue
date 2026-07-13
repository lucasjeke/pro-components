<docs lang="zh-CN">
头像，标题，描述区域可以自由组合或者单独呈现，组件会为你调整为最合适的对齐方式。
</docs>

<docs lang="en-US">
头像，标题，描述区域可以自由组合或者单独呈现，组件会为你调整为最合适的对齐方式。
</docs>

<script setup lang="ts">
import { ProCheckCard } from '@antdv-next1/pro-components'
</script>

<template>
  <div>
    <h3>只有图片时</h3>
    <ProCheckCard
      avatar="https://gw.alipayobjects.com/zos/bmw-prod/f601048d-61c2-44d0-bf57-ca1afe7fd92e.svg"
    />

    <h3>只有图片和描述时</h3>
    <ProCheckCard
      avatar="https://gw.alipayobjects.com/zos/bmw-prod/f601048d-61c2-44d0-bf57-ca1afe7fd92e.svg"
      description="选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念。"
    />
    <h3>只有标题和描述时</h3>
    <ProCheckCard
      title="示例"
      description="选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念。"
    />
    <h3>只有标题和图片</h3>
    <ProCheckCard
      title="示例"
      avatar="https://gw.alipayobjects.com/zos/bmw-prod/f601048d-61c2-44d0-bf57-ca1afe7fd92e.svg"
    />
    <h3>只有标题</h3>
    <ProCheckCard title="示例" />
    <h3>只有描述时</h3>
    <ProCheckCard
      description="选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念。"
    />
  </div>
</template>

<style scoped></style>
