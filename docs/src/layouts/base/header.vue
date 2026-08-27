<script setup lang="ts">
import type { SelectInfo } from '@v-c/menu'
import { GithubOutlined } from '@antdv-next/icons'
import { storeToRefs } from 'pinia'
import { computed, h, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DocSearch from '@/components/DocSearch/index.vue'
import { DirectionIcon } from '@/components/icons'
import { useLocale } from '@/composables/use-locale'
import { headerItems, headerLocales } from '@/config/menu/header'
import SwitchBtn from '@/layouts/base/components/switch-btn.vue'
import ThemeBtn from '@/layouts/base/components/theme-btn.vue'
import { useAppStore } from '@/store/modules/app'
import { toCnPathname, toEnPathname, toLocalePathname } from '@/utils/locale-path'

const route = useRoute()
const appStore = useAppStore()
const { headerKey, locale, direction } = storeToRefs(appStore)
const { t } = useLocale()
const router = useRouter()

function handleHeaderChange(info: SelectInfo) {
  const key = info.key

  if (typeof key !== 'string')
    return

  router.push({
    path: toLocalePathname(key, appStore.locale),
  })
}

const itemKeys = headerItems.map(item => item?.key).filter(Boolean) as string[]
const headerPrefixes = [...itemKeys].sort((a, b) => b.length - a.length)
watch(
  () => route.path,
  () => {
    const currentPath = route.path.replace(/^\/en-US/, '') || '/'

    appStore.setSiderKey([currentPath])
    const matchedHeaderPrefix = headerPrefixes.find(prefix =>
      currentPath === prefix || currentPath.startsWith(`${prefix}/`),
    )
    appStore.setHeaderKey(matchedHeaderPrefix ? [matchedHeaderPrefix] : [])
  },
  { immediate: true },
)

function changeLocale(value: 1 | 2) {
  const nextLocale = value === 1 ? 'zh-CN' : 'en-US'
  const nextPath = nextLocale === 'zh-CN'
    ? toCnPathname(route.path)
    : toEnPathname(route.path)

  appStore.setLocale(nextLocale)
  router.push({
    path: nextPath,
    hash: route.hash,
  })
}
const localeValue = computed(() => {
  return locale.value === 'zh-CN' ? 1 : 2
})

const directionValue = computed(() => {
  return direction.value === 'ltr' ? 1 : 2
})

function changeDirection(value: 1 | 2) {
  appStore.toggleDirection(value === 1 ? 'ltr' : 'rtl')
}
</script>

<template>
  <a-layout-header class="!p-is-6 !p-ie-6 !h-[--ant-doc-header-height] sticky inset-t-0 w-full !z-950 !a-shadow-ter !backdrop-blur-[8px] !self-stretch !bg-[color-mix(in_srgb_,_var(--ant-color-bg-container)_,_transparent_20%)]">
    <a-row>
      <a-col :xxl="4" :xl="5" :lg="6" :md="6" :sm="24" :xs="24">
        <h1 class="m-0 p-0 flex items-center">
          <router-link
            class="inline-flex items-center h-(--ant-doc-header-height) line-height-[var(--ant-doc-header-height)] text-5.5 font-500 a-color-text hover:a-color-text of-hidden"
            to="/"
          >
            <img src="../../assets/logo.png" class="size-10 inline-block align-middle" draggable="false" alt="logo">
            <span class="ml-2 c-[--ant-color-text-secondary]">
              ProComponents Vue
            </span>
          </router-link>
        </h1>
      </a-col>
      <a-col :xxl="20" :xl="19" :lg="18" :md="18" :sm="0" :xs="0">
        <a-flex gap="medium" align="center">
          <a-menu
            class="h-full border-b-none! !bg-transparent flex-1"
            :selected-keys="headerKey"
            style="--ant-menu-horizontal-line-height: var(--ant-doc-header-height)"
            mode="horizontal"
            :items="headerItems"
            :label-render="({ key, label }) => h('span', {}, headerLocales?.[key]?.[locale] ?? label)"
            @select="handleHeaderChange"
          />
          <div class="flex items-center m-0 flex-[0_1_clamp(220px_,_24vw_,_280px)]">
            <DocSearch class="w-full" />
          </div>
          <SwitchBtn
            key="lang" :value="localeValue" :tooltip1="t('layout.header.languageTooltip1')" :tooltip2="t('layout.header.languageTooltip2')"
            @click="changeLocale"
          >
            <template #label1>
              中
            </template>
            <template #label2>
              En
            </template>
          </SwitchBtn>
          <SwitchBtn
            key="direction" :value="directionValue" :tooltip1="t('layout.header.directionTooltip1')" :tooltip2="t('layout.header.directionTooltip2')"
            pure
            aria-label="RTL Switch Button" @click="changeDirection"
          >
            <template #label1>
              <DirectionIcon class="w-20px" direction="ltr" />
            </template>
            <template #label2>
              <DirectionIcon class="w-20px" direction="rtl" />
            </template>
          </SwitchBtn>
          <ThemeBtn />
          <a key="github" href="https://github.com/lucasjeke/pro-components" target="_blank" rel="noreferrer">
            <a-tooltip title="GitHub" destroy-on-hidden>
              <a-button type="text" class="text-16px">
                <template #icon>
                  <GithubOutlined />
                </template>
              </a-button>
            </a-tooltip>
          </a>
        </a-flex>
      </a-col>
    </a-row>
  </a-layout-header>
</template>

<style lang="less">
</style>
