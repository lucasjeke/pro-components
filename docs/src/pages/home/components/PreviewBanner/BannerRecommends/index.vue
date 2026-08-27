<script lang="ts" setup>
import type { HomeRecommendLocale } from '@/config/home-recommends'
import { computed } from 'vue'
import {
  getHomeRecommendIcons,
  getHomeRecommends,
} from '@/config/home-recommends'
import { useAppStore } from '@/store/modules/app'
import RecommendCard from './RecommendCard.vue'

const appStore = useAppStore()
const locale = computed<HomeRecommendLocale>(() => appStore.locale.startsWith('zh') ? 'cn' : 'en')
const recommends = computed(() => getHomeRecommends(locale.value))
const icons = computed(() => getHomeRecommendIcons())

function getIcon(source: string) {
  return icons.value.find(icon => icon.name === source)
}
</script>

<template>
  <div class="antdv-home-recommends-container">
    <RecommendCard
      v-for="(item, index) in recommends"
      :key="`desktop-${item.source}`"
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
  grid-template-columns: repeat(3, minmax(260px, 1fr));
  margin-inline: auto;
  box-sizing: border-box;
  gap: clamp(20px, 2.6vw, 36px);
  text-align: start;
  perspective: 1200px;
}

@media (max-width: 991px) {
  .antdv-home-recommends-container {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }
}

@media (max-width: 640px) {
  .antdv-home-recommends-container {
    grid-template-columns: 1fr;
    gap: 14px;
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
