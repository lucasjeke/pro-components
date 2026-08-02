<docs lang="zh-CN">
配置 `size` 尺寸大小，当前可选 `large`，`default`，`small`，不同尺寸仅宽度不同。
</docs>

<docs lang="en-US">
配置 `size` 尺寸大小，当前可选 `large`，`default`，`small`，不同尺寸仅宽度不同。
</docs>

<script setup lang="ts">
import { ProCheckCard } from '@antdv-next1/pro-components'
import { RadioButton, RadioGroup } from 'antdv-next'
import { ref } from 'vue'

const size = ref<'default' | 'large' | 'small'>('default')
</script>

<template>
  <div style="margin-block-end: 16px">
    <RadioGroup v-model:value="size">
      <RadioButton value="large">
        Large
      </RadioButton>
      <RadioButton value="default">
        Default
      </RadioButton>
      <RadioButton value="small">
        Small
      </RadioButton>
    </RadioGroup>
  </div>
  <ProCheckCard title="Card title" description="This is the description" :size="size" />
</template>

<style  scoped></style>
