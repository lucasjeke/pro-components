<docs lang="zh-CN">
通过卡片切分能力我们很容易实现左右分栏的效果，很适合左侧是列表，右侧是详情的结构。
</docs>

<docs lang="en-US">
通过卡片切分能力我们很容易实现左右分栏的效果，很适合左侧是列表，右侧是详情的结构。
</docs>

<script setup lang="ts">
import { ProCard } from '@antdv-next1/pro-components'
</script>

<template>
  <div class="p-6">
    <ProCard split="vertical">
      <ProCard title="Left Details" col-flex="30%">
        Left Content
      </ProCard>
      <ProCard title="Left and Right Columns with Title" header-bordered>
        <div :style="{ height: '360px' }">
          Right Content
        </div>
      </ProCard>
    </ProCard>
  </div>
</template>

<style scoped></style>
