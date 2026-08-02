import type { DemoCodeType, InnerLocale, ThemeMode } from '#/config'
import { defineStore } from 'pinia'
import { menusMap } from '@/config/menu'
import { detectInnerLocale } from '@/utils/locale'

export const useAppStore = defineStore('app', () => {
  const headerKey = ref<string[]>([])
  const siderKey = ref<string[]>([])
  const siderOpenKeys = ref<string[]>([])
  const locale = ref<InnerLocale>(detectInnerLocale())
  const darkMode = ref<boolean>(false)
  const compactMode = ref<boolean>(false)
  const happyMode = ref<boolean>(false)
  const direction = ref<'ltr' | 'rtl'>('ltr')
  const theme = ref<ThemeMode>('light')
  const demoCodeType = ref<DemoCodeType>('ts')
  const siderMenus = computed(() => {
    const currentKey = headerKey.value[0]
    if (!currentKey) {
      return []
    }
    const currentMenus = menusMap[currentKey]
    if (currentMenus) {
      return currentMenus.menus
    }
    return []
  })
  const siderLocales = computed(() => {
    const currentKey = headerKey.value[0]
    if (!currentKey) {
      return {}
    }
    const currentMenus = menusMap[currentKey]
    if (currentMenus) {
      return currentMenus.locales
    }
    return {}
  })
  const setTheme = (_theme: ThemeMode) => {
    theme.value = _theme
  }
  const setHeaderKey = (keys: string[]) => {
    headerKey.value = keys
  }
  const setSiderKey = (keys: string[]) => {
    siderKey.value = keys
  }
  const setSiderOpenKeys = (keys: string[]) => {
    siderOpenKeys.value = keys
  }
  const setLocale = (_locale: InnerLocale) => {
    locale.value = _locale
  }
  const toggleDarkMode = (_darkMode?: boolean) => {
    darkMode.value = _darkMode || !darkMode.value
  }
  const toggleCompactMode = (_compactMode?: boolean) => {
    compactMode.value = _compactMode || !compactMode.value
  }
  const toggleHappyMode = (_happyMode?: boolean) => {
    happyMode.value = _happyMode !== undefined ? _happyMode : !happyMode.value
  }
  const toggleDirection = (_direction?: 'ltr' | 'rtl') => {
    direction.value = _direction || (direction.value === 'ltr' ? 'rtl' : 'ltr')
  }
  const setDemoCodeType = (type: DemoCodeType) => {
    demoCodeType.value = type
  }
  return {
    setHeaderKey,
    setSiderKey,
    siderMenus,
    setTheme,
    setSiderOpenKeys,
    siderLocales,
    setLocale,
    toggleDarkMode,
    toggleCompactMode,
    toggleHappyMode,
    toggleDirection,
    setDemoCodeType,
    siderKey,
    theme,
    siderOpenKeys,
    locale,
    darkMode,
    compactMode,
    happyMode,
    direction,
    demoCodeType,
    headerKey,
  }
})
