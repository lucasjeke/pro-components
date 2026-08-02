<docs lang="zh-CN">
布局模式下通过配置 `split` 可以方便地切分卡片，可以进行任意的分栏，不管是横切还是竖切都非常便利，切分出来的分栏仍然保有卡片的特性，高度自动撑满。注意：

- 切分时父卡片的内容 `padding` 会被设置为 0。
- 切分时子卡片的 `border-radius`会被设置为 0。
</docs>

<docs lang="en-US">
布局模式下通过配置 `split` 可以方便地切分卡片，可以进行任意的分栏，不管是横切还是竖切都非常便利，切分出来的分栏仍然保有卡片的特性，高度自动撑满。注意：

- 切分时父卡片的内容 `padding` 会被设置为 0。
- 切分时子卡片的 `border-radius`会被设置为 0。
</docs>

<script setup lang="ts">
import { ProCard } from '@antdv-next1/pro-components'
import ResizeObserver from '@v-c/resize-observer'
import { shallowRef } from 'vue'

const responsive = shallowRef(false)
</script>

<template>
  <div class="p-6">
    <ResizeObserver
      @resize="(offset) => {
        responsive = offset.width < 596
      }"
    >
      <ProCard
        title="Left and Right Columns with Title"
        extra="September 28, 2019"
        :split="responsive ? 'horizontal' : 'vertical'"
        variant="outlined"
        header-bordered
      >
        <ProCard title="Left Details" col-flex="50%">
          <div :style="{ height: '360px' }">
            Left Content
          </div>
        </ProCard>
        <ProCard title="Traffic Usage">
          <div :style="{ height: '360px' }">
            Right Content
          </div>
        </ProCard>
      </ProCard>
    </ResizeObserver>
  </div>
</template>

<style scoped></style>
