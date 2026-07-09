<docs lang="zh-CN">
在 ProLayout 中通过 multiTabRender 插槽接入受控 MultiTab。示例中的标签数据、激活项和关闭逻辑都由外层状态维护，MultiTab 只负责渲染和派发事件。
</docs>

<docs lang="en-US">
Use the multiTabRender slot to render a controlled MultiTab inside ProLayout. The tab items, active key, and close behavior are all managed by the outer state.
</docs>

<script setup lang="ts">
import type { MenuDataItem, MenuItemRender, MultiTabItem } from '@antdv-next1/pro-layout'
import { MultiTab, PageContainer, ProLayout } from '@antdv-next1/pro-layout'
import { DashboardOutlined, FileTextOutlined, SettingOutlined, TeamOutlined } from '@antdv-next/icons'
import { Card, Space, Tag } from 'antdv-next'
import { computed, reactive, ref } from 'vue'

const location = reactive({
  path: '/dashboard',
})

const routeObj: MenuDataItem = {
  path: '/',
  name: 'Root',
  children: [
    {
      path: '/dashboard',
      name: 'Dashboard',
      meta: {
        title: '工作台',
        icon: DashboardOutlined,
      },
    },
    {
      path: '/projects',
      name: 'Projects',
      meta: {
        title: '项目列表',
        icon: FileTextOutlined,
      },
    },
    {
      path: '/team',
      name: 'Team',
      meta: {
        title: '团队管理',
        icon: TeamOutlined,
      },
    },
    {
      path: '/settings',
      name: 'Settings',
      meta: {
        title: '系统设置',
        icon: SettingOutlined,
      },
    },
  ],
}

const pageTitleMap: Record<string, string> = {
  '/dashboard': '工作台',
  '/projects': '项目列表',
  '/team': '团队管理',
  '/settings': '系统设置',
}

const tabs = ref<MultiTabItem[]>([
  {
    key: '/dashboard',
    path: '/dashboard',
    title: '工作台',
    closable: false,
  },
])
const activeKey = ref('/dashboard')
const refreshCount = ref(0)
const refreshItem = ref<MultiTabItem | null>(null)
const activeTitle = computed(() => pageTitleMap[activeKey.value] || activeKey.value)

function openTab(path: string) {
  const title = pageTitleMap[path] || path
  if (!tabs.value.some(item => item.key === path)) {
    tabs.value = [
      ...tabs.value,
      {
        key: path,
        path,
        title,
      },
    ]
  }

  activeKey.value = path
  location.path = path
}

function activateTab(item: MultiTabItem) {
  activeKey.value = item.key
  location.path = item.path || item.key
}

function selectNextActive(closedIndex: number) {
  const next = tabs.value[closedIndex] || tabs.value[closedIndex - 1]
  if (next)
    activateTab(next)
}

function closeTab(key: string) {
  const index = tabs.value.findIndex(item => item.key === key)
  const target = tabs.value[index]
  if (!target || target.closable === false)
    return

  tabs.value = tabs.value.filter(item => item.key !== key)
  if (activeKey.value === key)
    selectNextActive(index)
}

function closeOther(key: string) {
  tabs.value = tabs.value.filter(item => item.key === key || item.closable === false)
  const active = tabs.value.find(item => item.key === key) || tabs.value[0]
  if (active)
    activateTab(active)
}

function closeLeft(key: string) {
  const index = tabs.value.findIndex(item => item.key === key)
  tabs.value = tabs.value.filter((item, itemIndex) => itemIndex >= index || item.closable === false)
  const active = tabs.value.find(item => item.key === activeKey.value) || tabs.value.find(item => item.key === key) || tabs.value[0]
  if (active)
    activateTab(active)
}

function closeRight(key: string) {
  const index = tabs.value.findIndex(item => item.key === key)
  tabs.value = tabs.value.filter((item, itemIndex) => itemIndex <= index || item.closable === false)
  const active = tabs.value.find(item => item.key === activeKey.value) || tabs.value.find(item => item.key === key) || tabs.value[0]
  if (active)
    activateTab(active)
}

function refreshTab(key: string) {
  const item = tabs.value.find(item => item.key === key)
  if (item) {
    item.loading = true
    refreshItem.value = item
  }
  // 设置当前的loading为false
  if (refreshItem.value) {
    // 增加一个取消的延迟
    setTimeout(() => {
      if (refreshItem.value) {
        refreshItem.value.loading = false
        refreshItem.value = null
      }
    }, 1000)
  }
  refreshCount.value += 1
}

function handleMenuClick(item: Parameters<MenuItemRender>[0]['item']) {
  if (item.path)
    openTab(item.path)
}
</script>

<template>
  <ProLayout
    title="Antdv Next Pro"
    layout="side"
    nav-theme="dark"
    fixed-header
    :location="location"
    :route="routeObj"
    style="min-height: 100vh"
  >
    <template #multiTabRender>
      <MultiTab
        :items="tabs"
        :active-key="activeKey"
        @change="(_, item) => activateTab(item)"
        @close="closeTab"
        @close-other="closeOther"
        @close-left="closeLeft"
        @close-right="closeRight"
        @refresh="refreshTab"
      />
    </template>

    <template #menuItemRender="{ item, dom }">
      <component :is="dom" @click="handleMenuClick(item)" />
    </template>

    <PageContainer :title="activeTitle" sub-title="MultiTab 不直接依赖 vue-router，业务在事件中控制跳转和关闭逻辑。">
      <Card>
        <Space direction="vertical" :size="12">
          <div class="layout-multi-tab-demo-title">
            {{ activeTitle }}
          </div>
          <Space>
            <Tag color="blue">
              当前路径：{{ location.path }}
            </Tag>
            <Tag color="green">
              刷新次数：{{ refreshCount }}
            </Tag>
          </Space>
        </Space>
      </Card>
    </PageContainer>
  </ProLayout>
</template>

<style scoped>
.layout-multi-tab-demo-title {
  color: rgba(0, 0, 0, 0.88);
  font-size: 18px;
  font-weight: 600;
}
</style>
