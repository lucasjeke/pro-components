<docs lang="zh-CN">
你可以通过 `avatar` 属性自定义头像区域。
</docs>

<docs lang="en-US">
你可以通过 `avatar` 属性自定义头像区域。
</docs>

<script setup lang="ts">
import { ProCheckCard } from '@antdv-next1/pro-components'
import { UserOutlined } from '@antdv-next/icons'
import { Avatar } from 'antdv-next'
import { h } from 'vue'
</script>

<template>
  <ProCheckCard
    title="示例标题"
    :avatar="
      h(Avatar, {
        icon: h(UserOutlined),
        size: 'large',
        style: {
          backgroundColor: '#7265e6',
        },
      })
    "
  />
</template>

<style scoped></style>
