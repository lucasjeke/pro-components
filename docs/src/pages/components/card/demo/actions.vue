<docs lang="zh-CN">
配置 `actions` 属性来配置卡片操作项。
</docs>

<docs lang="en-US">
配置 `actions` 属性来配置卡片操作项。
</docs>

<script setup lang="ts">
import { ProCard } from '@antdv-next1/pro-components'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@antdv-next/icons'
import { h } from 'vue'
</script>

<template>
  <div class="p-6">
    <a-space>
      <ProCard
        title="Actions"
        :style="{ maxWidth: '300px' }"
        :actions="[
          h(SettingOutlined, { key: 'setting' }),
          h(EditOutlined, { key: 'edit' }),
          h(EllipsisOutlined, { key: 'ellipsis' }),
        ]"
      >
        <div>Card content</div>
        <div>Card content</div>
        <div>Card content</div>
      </ProCard>
      <ProCard
        title="Standalone Actions"
        :style="{ maxWidth: '300px' }"
        variant="outlined"
        :actions="[h('div', {
                       style: {
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         padding: '12px',
                         flex: 1,
                         gap: '8px',
                       },
                     },
                     [h(SettingOutlined, { key: 'setting' }), 'Settings'],
        )]"
      >
        <div>Card content</div>
        <div>Card content</div>
        <div>Card content</div>
      </ProCard>
      <ProCard
        variant="outlined"
        title="No Actions"
        :style="{ maxWidth: '300px' }"
      >
        <div>Card content</div>
        <div>Card content</div>
        <div>Card content</div>
      </ProCard>
    </a-space>
  </div>
</template>

<style scoped></style>
