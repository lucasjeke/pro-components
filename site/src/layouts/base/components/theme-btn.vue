<script setup lang="ts">
import type { MenuProps } from 'antdv-next'
import { MoonOutlined, SunOutlined, SyncOutlined } from '@antdv-next/icons'
import { storeToRefs } from 'pinia'
import { computed, h } from 'vue'
import { ThemeIcon } from '@/components/icons'
import { useTheme } from '@/composables/theme'
import { useLocale } from '@/composables/use-locale'
import { useAppStore } from '@/store/modules/app'

defineOptions({
  name: 'ThemeBtn',
})

const { setThemeMode } = useTheme()
// const confirm = Modal.confirm
const appStore = useAppStore()
const { theme } = storeToRefs(appStore)

const { t } = useLocale()

const BlueDot = h('span', {
  style: {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#1677ff',
  },
})

const themeMenuItems = computed<MenuProps['items']>(() => [
  {
    key: 'system',
    label: t('ui.themeBtn.system'),
    icon: h(SyncOutlined),
    extra: theme.value === 'system' ? BlueDot : undefined,
  },
  {
    key: 'light',
    label: t('ui.themeBtn.light'),
    icon: h(SunOutlined),
    extra: theme.value === 'light' ? BlueDot : undefined,
  },
  {
    key: 'dark',
    label: t('ui.themeBtn.dark'),
    icon: h(MoonOutlined),
    extra: theme.value === 'dark' ? BlueDot : undefined,
  },
])

function handleMenuClick(info: { key: string, domEvent: MouseEvent }) {
  const { key, domEvent } = info
  if (key === 'system' || key === 'light' || key === 'dark') {
    appStore.setTheme(key)
    setThemeMode(key, domEvent)
  }
  else if (key === 'compact') {
    appStore.toggleCompactMode()
  }
  else if (key === 'happy') {
    appStore.toggleHappyMode()
  }
}
</script>

<template>
  <a-dropdown
    :menu="{ items: themeMenuItems }"
    :trigger="['hover']"
    placement="bottomRight"
    @menu-click="handleMenuClick"
  >
    <a-button type="text" class="text-16px">
      <template #icon>
        <ThemeIcon />
      </template>
    </a-button>
  </a-dropdown>
</template>
