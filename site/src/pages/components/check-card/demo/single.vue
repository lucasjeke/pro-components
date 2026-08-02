<docs lang="zh-CN">
在多个选项存在的情况下可通过 `ProCheckCard.Group` 分组，默认选项卡组件为单选模式。
</docs>

<docs lang="en-US">
在多个选项存在的情况下可通过 `ProCheckCard.Group` 分组，默认选项卡组件为单选模式。
</docs>

<script setup lang="ts">
import { ProCheckCard, ProCheckCardGroup } from '@antdv-next1/pro-components'
</script>

<template>
  <div class="p-6">
    <ProCheckCardGroup
      default-value="A"
      @change="
        (value) => {
          console.log('value', value)
        }
      "
    >
      <ProCheckCard border-beam title="Card A" description="选项一" value="A" />
      <ProCheckCard border-beam title="Card B" description="选项二" value="B" />
      <ProCheckCard border-beam title="Card C" disabled description="选项三，这是一个不可选项" value="C" />
    </ProCheckCardGroup>
  </div>
</template>

<style scoped></style>
