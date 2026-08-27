<script setup lang="ts">
import Icon from '@antdv-next/icons'
import { storeToRefs } from 'pinia'
import { useLocale } from '@/composables/use-locale'
import { useAppStore } from '@/store/modules/app'
import { toLocalePathname } from '@/utils/locale-path'
import BannerRecommends from './BannerRecommends/index.vue'
import GroupMaskLayer from './GroupMaskLayer/index.vue'
import LuminousBg from './LuminousBg/index.vue'

const appStore = useAppStore()
const { locale } = storeToRefs(appStore)
const { t } = useLocale()
</script>

<template>
  <GroupMaskLayer>
    <div
      class="flex flex-col justify-center items-center
    "
    >
      <LuminousBg />
      <a-typography
        component="article"
        class="z-1 text-center m-bs-20"
      >
        <h1
          class="!text-[calc(var(--ant-font-size-heading-2)_*_2.2)] relative !font-[AliPuHui_,_var(--ant-font-family)]  !line-height-[--ant-line-height-heading-1]
        "
        >
          <div class="!color-transparent">
            ProComponents Vue
          </div>
          <div class="absolute z-0 c-[--ant-color-text-secondary] inset-t-0 inset-l-0 text-[calc(var(--ant-font-size-heading-2)_*_2.2)] font-bold will-change-transform text-shadow-[rgba(19_,_194_,_194_,_0.2)_0px_8px_20px_,_rgba(114_,_46_,_209_,_0.2)_0px_8px_60px_,_rgba(19_,_194_,_194_,_0.4)_0px_8px_80px] font-[AliPuHui_,_var(--ant-font-family)] line-height-[--ant-line-height-heading-1]">
            ProComponents Vue
          </div>
        </h1>
        <p class="text-[calc(var(--ant-font-size-lg)_*_1.5)] color-[--ant-color-text-tertiary]">
          {{ t('home.slogan') }}
        </p>
      </a-typography>
      <a-button
        type="primary" shape="round" :href="toLocalePathname('/components', locale)" size="large" icon="🚀" :classes="{
          root: '!before:content-[\'\'] !before:opacity-[1] !before:absolute !before:inset-[-1px] !before:transition-all !before:transition-duration-300 !before:bg-[linear-gradient(90deg,rgb(22_,_119_,_255),rgb(19_,_194_,_194))] !before:rounded-inherit !relative !m-bs-5 !m-be-20 !h-[calc(var(--ant-control-height-lg)_*_1.2)]',
          content: 'z-1',
          icon: 'z-1',
        }"
      >
        {{ t('home.start') }}
        <Icon>
          <template #component>
            →
          </template>
        </Icon>
      </a-button>
      <div class="relative w-full max-w-300 m-is-auto m-ie-auto m-bs-0 m-be-20 z-1">
        <BannerRecommends />
      </div>
    </div>
  </GroupMaskLayer>
</template>

<style scoped lang="less">

</style>
