<script lang="ts" setup>
defineOptions({ name: 'BashTabs' })

const { tabItems, defaultActiveKey } = defineProps<BashTabsProps>()
interface TabItemsType {
  key?: string
  children?: string | undefined
  label?: string
}
interface BashTabsProps {
  /** tab 配置项 */
  tabItems?: TabItemsType[]
  /** 默认 tab key */
  defaultActiveKey?: string
}
</script>

<template>
  <a-tabs
    :items="tabItems" size="small" :default-active-key="defaultActiveKey" :classes="{
      header: '!m-0',
    }"
  />
</template>
