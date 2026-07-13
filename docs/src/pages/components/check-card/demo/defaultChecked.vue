<docs lang="zh-CN">
通过配置 `defaultChecked` 属性为 `true` 来配置选项默认被选中。
</docs>

<docs lang="en-US">
通过配置 `defaultChecked` 属性为 `true` 来配置选项默认被选中。
</docs>

<script setup lang="ts">
import { ProCheckCard } from '@antdv-next1/pro-components'
</script>

<template>
  <ProCheckCard
    avatar="https://gw.alipayobjects.com/zos/bmw-prod/f601048d-61c2-44d0-bf57-ca1afe7fd92e.svg"
    title="示例二"
    default-checked
    @change="
      (checked) => {
        console.log('checked', checked)
      }
    "
  />
</template>

<style scoped></style>
