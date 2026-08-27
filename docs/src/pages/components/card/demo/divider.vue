<docs lang="zh-CN">
你可以嵌套卡片组件来将内容分组，以及 `Divider` 子组件来分隔这些内容。
</docs>

<docs lang="en-US">
你可以嵌套卡片组件来将内容分组，以及 `Divider` 子组件来分隔这些内容。
</docs>

<script setup lang="ts">
import { ProCard, ProCardDivider, ProCardGroup } from '@antdv-next1/pro-components'
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
      <ProCardGroup
        title="Core Metrics"
        :direction="responsive ? 'column' : 'row'"
      >
        <ProCard>
          <a-statistic title="Today's UV" :value="79.0" :precision="2" />
        </ProCard>
        <ProCardDivider :orientation="responsive ? 'horizontal' : 'vertical'" />
        <ProCard>
          <a-statistic title="Frozen Amount" :value="112893.0" :precision="2" />
        </ProCard>
        <ProCardDivider :orientation="responsive ? 'horizontal' : 'vertical'" />
        <ProCard>
          <a-statistic
            title="Information Completeness"
            :value="93"
            suffix="/ 100"
          />
        </ProCard>
        <ProCardDivider :orientation="responsive ? 'horizontal' : 'vertical'" />
        <ProCard>
          <a-statistic title="Frozen Amount" :value="112893.0" />
        </ProCard>
      </ProCardGroup>
    </ResizeObserver>
  </div>
</template>

<style scoped></style>
