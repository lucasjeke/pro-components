<docs lang="zh-CN">
collapsible 支持 `icon（图标触发）和` `header`（标题触发）两种模式
</docs>

<docs lang="en-US">
collapsible supports `icon` (click icon) and `header` (click title) modes
</docs>

<script setup lang="ts">
import { ProCard } from '@antdv-next1/pro-components'
</script>

<template>
  <div class="p-6 card-demo-list">
    <ProCard title="不可折叠">
      <ProCard
        title="不可折叠的卡片"
        tooltip="collapsible: false（默认）"
        extra="内容"
        :style="{ marginBlockStart: '16px' }"
      >
        <div>这个卡片不能折叠</div>
      </ProCard>
    </ProCard>

    <ProCard title="图标触发折叠" :style="{ marginBlockStart: '24px' }">
      <ProCard
        title="图标触发的卡片"
        tooltip="collapsible: icon"
        collapsible
        extra="内容"
        :style="{ marginBlockStart: '16px' }"
      >
        <div>点击右上角的图标可以折叠此卡片</div>
      </ProCard>
    </ProCard>
    <ProCard title="标题触发折叠" :style="{ marginBlockStart: '24px' }">
      <ProCard
        title="标题触发的卡片"
        tooltip="collapsible: header"
        collapsible="header"
        extra="内容"
        :style="{ marginBlockStart: '16px' }"
      >
        <div>点击标题可以折叠此卡片</div>
      </ProCard>
    </ProCard>
  </div>
</template>

<style scoped>
.card-demo-list {
  display: grid;
  gap: 16px;
}
</style>
