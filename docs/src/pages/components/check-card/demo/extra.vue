<docs lang="zh-CN">
配置 `extra` 为卡片添加操作栏。
</docs>

<docs lang="en-US">
配置 `extra` 为卡片添加操作栏。
</docs>

<script setup lang="ts">
import { ProCheckCard } from '@antdv-next1/pro-components'
import { EllipsisOutlined } from '@antdv-next/icons'
</script>

<template>
  <ProCheckCard
    description="选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念。"
    title="示例一"
    avatar="https://gw.alipayobjects.com/zos/bmw-prod/f601048d-61c2-44d0-bf57-ca1afe7fd92e.svg"
  >
    <template #extra>
      <a-dropdown
        placement="top" :menu="{
          items: [
            {
              label: '菜单',
              key: '1',
            },
            {
              label: '列表',
              key: '2',
            },
            {
              label: '表单',
              key: '3',
            },
          ],
        }"
      >
        <EllipsisOutlined :style="{ fontSize: '22px', color: 'rgba(0,0,0,0.5)' }" />
      </a-dropdown>
    </template>
  </ProCheckCard>
</template>

<style  scoped></style>
