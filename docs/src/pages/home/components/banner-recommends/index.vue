<script setup lang="ts">
import type { HomeRecommendLocale } from '@/config/home-recommends'
import { computed } from 'vue'
import { localeStore } from '@/composables/local-store'
import { useMobile } from '@/composables/mobile'
import {
  getHomeRecommendIcons,
  getHomeRecommends,
} from '@/config/home-recommends'
import RecommendCard from './recommend-card.vue'

const { isMobile } = useMobile()

const locale = computed<HomeRecommendLocale>(() => localeStore.value.startsWith('zh') ? 'cn' : 'en')
const recommends = computed(() => getHomeRecommends(locale.value))
const icons = computed(() => getHomeRecommendIcons())

function getIcon(source: string) {
  return icons.value.find(icon => icon.name === source)
}
</script>

<template>
  <a-carousel v-if="isMobile" class="antdv-home-recommends-carousel">
    <div
      v-for="(item, index) in recommends"
      :key="`mobile-${item.href}`"
    >
      <RecommendCard
        :item="item"
        :index="index"
        :icon="getIcon(item.source)"
        card-class="antdv-home-recommends-slider-item"
      />
    </div>
  </a-carousel>

  <div v-else class="antdv-home-recommends-container">
    <RecommendCard
      v-for="(item, index) in recommends"
      :key="`desktop-${item.href}`"
      :item="item"
      :index="index"
      :icon="getIcon(item.source)"
    />
  </div>
</template>

<style scoped>
.antdv-home-recommends-container {
  display: grid;
  width: 100%;
  max-width: 100%;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  min-height: 178px;
  margin-inline: auto;
  box-sizing: border-box;
  gap: calc(var(--ant-padding-md) * 2);
  text-align: start;
}

@media (max-width: 991px) {
  .antdv-home-recommends-container {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.antdv-home-recommends-slider-item {
  margin: 0 var(--ant-margin);
}

.antdv-home-recommends-carousel {
  width: 100%;
}

.antdv-home-recommends-carousel :deep(.slick-dots.slick-dots-bottom) {
  bottom: -22px;
}

.antdv-home-recommends-carousel :deep(.slick-dots.slick-dots-bottom li) {
  width: 6px;
  height: 6px;
  background: #e1eeff;
  border-radius: 50%;
}

.antdv-home-recommends-carousel :deep(.slick-dots.slick-dots-bottom li button) {
  height: 6px;
  background: #e1eeff;
  border-radius: 50%;
}

.antdv-home-recommends-carousel :deep(.slick-dots.slick-dots-bottom li.slick-active),
.antdv-home-recommends-carousel :deep(.slick-dots.slick-dots-bottom li.slick-active button) {
  background: #4b9cff;
}

:deep(.antdv-home-recommend-ribbon) {
  height: 100%;
}

:deep(.antdv-home-recommend-ribbon > .antdv-home-recommend-card) {
  height: 100%;
}
</style>
