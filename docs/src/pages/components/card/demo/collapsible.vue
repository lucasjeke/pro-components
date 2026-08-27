<docs lang="zh-CN">
- 你可以使用 `collapsible` 来配置卡片是否可折叠，通过 `defaultCollapsed` 属性配置是否默认折叠。
- 或者你可以通过 `collapsed` 属性受控进行自定义。
</docs>

<docs lang="en-US">
- Use `collapsible` to make a card collapsible and `defaultCollapsed` to configure its initial state.
- Use `v-model:collapsed` when the collapsed state should be controlled externally.
</docs>

<script setup lang="ts">
import { ProCard } from '@antdv-next1/pro-components'
import { RightOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const collapsed = shallowRef(false)
</script>

<template>
  <div
    class="p-6"
    :style="{
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      gap: '12px',
    }"
  >
    <ProCard
      title="Collapsible"
      header-bordered
      collapsible
      default-collapsed
    >
      <template #extra>
        <a-button size="small" @click.stop="(e) => e.stopPropagation()">
          Submit
        </a-button>
      </template>
      Content
    </ProCard>
    <ProCard
      v-model:collapsed="collapsed"
      title="Collapsible"
      header-bordered
      collapsible="icon"
      default-collapsed
    >
      <template #extra>
        <a-button size="small" @click.stop="(e) => e.stopPropagation()">
          Submit
        </a-button>
      </template>
      Content
    </ProCard>
    <ProCard
      v-model:collapsed="collapsed"
      title="Collapsible"
      header-bordered
      collapsible
      default-collapsed
    >
      <template #extra>
        <a-button size="small" @click.stop="(e) => e.stopPropagation()">
          Submit
        </a-button>
      </template>
      Content
    </ProCard>
    <ProCard
      v-model:collapsed="collapsed"
      size="small"
      title="Collapsible"
      header-bordered
      collapsible
      default-collapsed
    >
      <template #extra>
        <a-button size="small" @click.stop="(e) => e.stopPropagation()">
          Submit
        </a-button>
      </template>
      Content
    </ProCard>
    <ProCard
      v-model:collapsed="collapsed"
      title="Collapsible - Controlled Custom"
      :style="{ marginBlockStart: '16px' }"
      header-bordered
    >
      <template #extra>
        <RightOutlined :rotate="!collapsed ? 90 : undefined" @click="() => collapsed = !collapsed" />
      </template>
      Content
    </ProCard>
    <ProCard
      v-model:collapsed="collapsed"
      title="Collapsible - Custom Icon (Controlled)"
      :collapsible-icon-render="({
        collapsed: buildInCollapsed,
      }: {
            collapsed: boolean;
      }) => buildInCollapsed ? h('span', null, 'Collapse - ') : h('span', null, 'Expand -')"
      :style="{ marginBlockStart: '16px' }"
      header-bordered
      collapsible
    >
      Content
    </ProCard>
    <ProCard
      title="Collapsible - Custom Icon"
      :collapsible-icon-render="({
        collapsed: buildInCollapsed,
      }: {
            collapsed: boolean;
      }) => buildInCollapsed ? h('span', null, 'Collapse - ') : h('span', null, 'Expand -')"
      :style="{ marginBlockStart: '16px' }"
      header-bordered
      collapsible
      default-collapsed
    >
      Content
    </ProCard>
  </div>
</template>

<style scoped>
</style>
