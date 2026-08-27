<docs lang="zh-CN">
`Steps` 组件结合 `ProCard` 组件完成竖向步骤示例。
</docs>

<docs lang="en-US">
`Steps` 组件结合 `ProCard` 组件完成竖向步骤示例。
</docs>

<script setup lang="ts">
import { ProCard } from '@antdv-next1/pro-components'
import ResizeObserver from '@v-c/resize-observer'

const current = shallowRef(0)
const responsive = shallowRef(false)
</script>

<template>
  <div class="p-6">
    <ResizeObserver
      @resize="(offset) => {
        responsive = offset.width < 596
      }"
    />
    <ProCard
      :split="responsive ? 'horizontal' : 'vertical'"
      :style="{ height: '320px' }"
    >
      <ProCard :col-span="responsive ? 24 : 6">
        <a-steps
          :orientation="responsive ? 'horizontal' : 'vertical'"
          size="small"
          :current="current"
          :style="{ height: '100%' }"
          :items="[
            { title: 'Fill in Basic Information' },
            { title: 'Configure Template' },
            { title: 'Configure Access' },
            { title: 'Configure Deployment and Scheduling' },
            { title: 'Preview' },
          ]"
        />
      </ProCard>
      <ProCard title="Traffic Usage" :col-span="responsive ? 24 : 18">
        <a-space>
          <a-button
            key="primary"
            type="primary"
            :disabled="current === 5"
            @click="() => current = current + 1"
          >
            Next
          </a-button>
          <a-button
            key="pre"
            :disabled="current === 0"
            @click="() => current = current - 1"
          >
            Previous
          </a-button>
        </a-space>
      </ProCard>
    </ProCard>
  </div>
</template>

<style scoped></style>
